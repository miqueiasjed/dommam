<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesse o Danuzio History Backstage</title>
</head>
<body style="background:#030406;color:#d4d4d8;font-family:sans-serif;margin:0;padding:40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
            <td style="padding:32px;background:#080a0e;border-radius:8px;border:1px solid #1c1f26;">
                <h2 style="color:#f59e0b;margin-top:0;font-size:22px;">Danuzio History Backstage</h2>
                <p style="color:#d4d4d8;margin-bottom:24px;">
                    Clique no botão abaixo para acessar o portal. O link expira em <strong>15 minutos</strong>.
                </p>
                <p style="text-align:center;margin:32px 0;">
                    <a href="{{ $link }}"
                       style="background:#b45309;color:#fff;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
                        Acessar agora
                    </a>
                </p>
                <p style="color:#71717a;font-size:13px;margin-bottom:8px;">
                    Se o botão não funcionar, copie e cole este link no navegador:
                </p>
                <p style="color:#71717a;font-size:12px;word-break:break-all;margin-top:0;">
                    {{ $link }}
                </p>
                <hr style="border:none;border-top:1px solid #1c1f26;margin:24px 0;">
                <p style="color:#52525b;font-size:12px;margin:0;">
                    Se você não solicitou este link, ignore este e-mail. Nenhuma ação é necessária.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
