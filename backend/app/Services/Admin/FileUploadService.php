<?php

namespace App\Services\Admin;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    private const MIMES_CAPA = ['jpeg', 'jpg', 'png', 'webp'];
    private const TAMANHO_MAX_CAPA_MB = 5;
    private const TAMANHO_MAX_PDF_MB = 50;

    /**
     * Faz upload da imagem de capa e retorna a URL pública.
     *
     * @throws \InvalidArgumentException Se o tipo de arquivo for inválido ou o tamanho exceder o limite
     */
    public function uploadCapa(UploadedFile $arquivo): string
    {
        $this->validarMime($arquivo, self::MIMES_CAPA, 'Tipo de arquivo inválido para capa. Permitidos: jpeg, jpg, png, webp.');
        $this->validarTamanho($arquivo, self::TAMANHO_MAX_CAPA_MB, 'Capa excede o tamanho máximo de 5MB.');

        $extensao = strtolower($arquivo->getClientOriginalExtension());
        $caminho = 'capas/' . Str::uuid() . '.' . $extensao;

        Storage::disk('public')->put($caminho, file_get_contents($arquivo->getRealPath()));

        return Storage::disk('public')->url($caminho);
    }

    /**
     * Faz upload do PDF do roteiro e retorna o path (sem URL pública).
     * O download ocorre via geração de marca d'água (Plano 5).
     *
     * @throws \InvalidArgumentException Se o tipo de arquivo for inválido ou o tamanho exceder o limite
     */
    public function uploadPdf(UploadedFile $arquivo): string
    {
        $this->validarMime($arquivo, ['pdf'], 'Tipo de arquivo inválido para roteiro. Permitido: pdf.');
        $this->validarTamanho($arquivo, self::TAMANHO_MAX_PDF_MB, 'PDF excede o tamanho máximo de 50MB.');

        $caminho = 'roteiros/' . Str::uuid() . '.pdf';

        Storage::put($caminho, file_get_contents($arquivo->getRealPath()));

        return $caminho;
    }

    /**
     * Remove um arquivo do storage se ele existir.
     */
    public function remover(string $caminho): void
    {
        if (Storage::exists($caminho)) {
            Storage::delete($caminho);
        }
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    /**
     * Valida o MIME type do arquivo.
     *
     * @throws \InvalidArgumentException
     */
    private function validarMime(UploadedFile $arquivo, array $mimesPermitidos, string $mensagem): void
    {
        $extensao = strtolower($arquivo->getClientOriginalExtension());
        $mime = strtolower($arquivo->getClientMimeType());

        $extensaoValida = in_array($extensao, $mimesPermitidos, true);
        $mimeValido = $this->mimeCorrespondeExtensoes($mime, $mimesPermitidos);

        if (!$extensaoValida || !$mimeValido) {
            throw new \InvalidArgumentException($mensagem);
        }
    }

    /**
     * Valida o tamanho máximo do arquivo em MB.
     *
     * @throws \InvalidArgumentException
     */
    private function validarTamanho(UploadedFile $arquivo, int $maxMb, string $mensagem): void
    {
        $tamanhoBytes = $arquivo->getSize();
        $maxBytes = $maxMb * 1024 * 1024;

        if ($tamanhoBytes > $maxBytes) {
            throw new \InvalidArgumentException($mensagem);
        }
    }

    /**
     * Verifica se o MIME type corresponde às extensões permitidas.
     */
    private function mimeCorrespondeExtensoes(string $mime, array $extensoes): bool
    {
        $mapaMimes = [
            'jpeg' => ['image/jpeg'],
            'jpg'  => ['image/jpeg'],
            'png'  => ['image/png'],
            'webp' => ['image/webp'],
            'pdf'  => ['application/pdf'],
        ];

        foreach ($extensoes as $extensao) {
            $mimesPermitidos = $mapaMimes[$extensao] ?? [];
            if (in_array($mime, $mimesPermitidos, true)) {
                return true;
            }
        }

        return false;
    }
}
