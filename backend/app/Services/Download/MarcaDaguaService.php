<?php

namespace App\Services\Download;

use Illuminate\Support\Facades\Log;
use setasign\Fpdi\Fpdi;

class MarcaDaguaService
{
    /**
     * Aplica marca d'água personalizada em cada página do PDF.
     *
     * @param  string  $pdfBytes  Conteúdo bruto do PDF master
     * @param  string  $email     E-mail do assinante
     * @param  string  $nome      Nome do assinante
     * @return string             Bytes do PDF resultante com marca d'água
     */
    public function aplicar(string $pdfBytes, string $email, string $nome): string
    {
        $arquivoEntrada = tempnam(sys_get_temp_dir(), 'pdf_entrada_');
        $arquivoSaida   = tempnam(sys_get_temp_dir(), 'pdf_saida_');

        try {
            file_put_contents($arquivoEntrada, $pdfBytes);

            $pdf = new Fpdi();
            $pdf->SetAutoPageBreak(false);

            $totalPaginas = $pdf->setSourceFile($arquivoEntrada);

            $dataDownload = now()->format('d/m/Y H:i');
            $hashCurto    = $this->gerarHashCurto($email);
            $textoRodape  = "{$nome} · {$email} · Download em {$dataDownload} · ID: {$hashCurto}";
            $textoCabecalho = 'Confidencial — distribuição proibida';

            for ($pagina = 1; $pagina <= $totalPaginas; $pagina++) {
                $templateId = $pdf->importPage($pagina);
                $tamanho    = $pdf->getTemplateSize($templateId);

                $pdf->AddPage($tamanho['orientation'], [$tamanho['width'], $tamanho['height']]);
                $pdf->useTemplate($templateId);

                $largura = $tamanho['width'];
                $altura  = $tamanho['height'];

                // Cor cinza claro para máxima compatibilidade (sem alpha nativo no FPDF)
                $pdf->SetTextColor(180, 180, 180);
                $pdf->SetFont('Arial', '', 8);

                // Rodapé: nome · email · data · hash — centralizado
                $pdf->SetXY(0, $altura - 8);
                $pdf->Cell($largura, 5, $textoRodape, 0, 0, 'C');

                // Cabeçalho: aviso de confidencialidade — alinhado à direita
                $pdf->SetXY(0, 3);
                $pdf->Cell($largura - 5, 5, $textoCabecalho, 0, 0, 'R');
            }

            $pdf->Output('F', $arquivoSaida);

            $resultado = file_get_contents($arquivoSaida);

            Log::info('MarcaDaguaService: PDF gerado com sucesso', [
                'email'        => $email,
                'hash'         => $hashCurto,
                'total_paginas' => $totalPaginas,
            ]);

            return $resultado;
        } finally {
            if (file_exists($arquivoEntrada)) {
                unlink($arquivoEntrada);
            }
            if (file_exists($arquivoSaida)) {
                unlink($arquivoSaida);
            }
        }
    }

    /**
     * Gera um hash curto único baseado no e-mail e timestamp atual.
     */
    private function gerarHashCurto(string $email): string
    {
        return strtoupper(substr(hash('sha256', $email . now()->timestamp), 0, 8));
    }
}
