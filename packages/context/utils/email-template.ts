export function emailTemplate({ title, content }: { title: string; content: string }): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
  `.trim();
}

export function createOtpEmailTemplate(name: string, otpCode: string): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potwierdzenie adresu email - Narzędzia dla Twórców</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #374151;
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #FDF2F8 100%);
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      margin-top: 40px;
      margin-bottom: 40px;
    }
    
    .header {
      background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 300;
      margin-bottom: 16px;
    }
    
    .header-subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 24px;
      color: #1F2937;
    }
    
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #4B5563;
      margin-bottom: 32px;
    }
    
    .otp-section {
      text-align: center;
      margin: 40px 0;
      padding: 32px;
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border-radius: 12px;
      border: 1px solid #BFDBFE;
    }
    
    .otp-label {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .otp-code {
      font-size: 42px;
      font-weight: 600;
      color: #1E40AF;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      margin-bottom: 16px;
      text-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }
    
    .otp-validity {
      font-size: 14px;
      color: #EF4444;
      font-weight: 500;
    }
    
    .instructions {
      background: #F9FAFB;
      padding: 24px;
      border-radius: 8px;
      border-left: 4px solid #3B82F6;
      margin: 32px 0;
    }
    
    .instructions h3 {
      font-size: 16px;
      color: #1F2937;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .instructions p {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 8px;
    }
    
    .footer {
      background: #F9FAFB;
      padding: 32px 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    
    .footer-text {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 16px;
    }
    
    .company-info {
      font-size: 12px;
      color: #9CA3AF;
    }
    
    .warning {
      background: #FEF3C7;
      border: 1px solid #F59E0B;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      font-size: 14px;
      color: #92400E;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        margin: 10px;
        border-radius: 12px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
      
      .footer {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NarzędziaDlaTwórców.pl</div>
      <div class="header-subtitle">Platforma dla profesjonalnych twórców treści</div>
    </div>
    
    <div class="content">
      <div class="greeting">Cześć ${name}! 👋</div>
      
      <div class="message">
        <p>Dzięki za rejestrację w <strong>NarzędziaDlaTwórców.pl</strong>! Aby dokończyć proces tworzenia konta i uzyskać dostęp do wszystkich narzędzi, musisz potwierdzić swój adres email.</p>
      </div>
      
      <div class="otp-section">
        <div class="otp-label">Twój kod weryfikacyjny</div>
        <div class="otp-code">${otpCode}</div>
        <div class="otp-validity">⏰ Kod wygasa za 15 minut</div>
      </div>
      
      <div class="instructions">
        <h3>Jak dokończyć weryfikację:</h3>
        <p>1. Wróć do strony rejestracji</p>
        <p>2. Wprowadź powyższy 6-cyfrowy kod</p>
        <p>3. Kliknij "Zweryfikuj email"</p>
        <p>4. Gotowe! Możesz zacząć korzystać z platformy</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Bezpieczeństwo:</strong> Jeśli to nie Ty rejestrowałeś się na naszej platformie, zignoruj tę wiadomość. Kod weryfikacyjny wygaśnie automatycznie za 15 minut.
      </div>
    </div>
    
    <div class="footer">
      
      <div class="company-info">
        © 2025 NarzędziaDlaTwórców.pl<br>
        Stworzone przez twórców, dla twórców<br>
        <a href="https://narzedziadlatworcow.pl/polityka-prywatnosci" style="color: #9CA3AF;">Polityka Prywatności</a> •
        <a href="https://narzedziadlatworcow.pl/regulamin" style="color: #9CA3AF;">Regulamin</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function createResendOtpEmailTemplate(otpCode: string): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nowy kod weryfikacyjny - Narzędzia dla Twórców</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #374151;
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #FDF2F8 100%);
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      margin-top: 40px;
      margin-bottom: 40px;
    }
    
    .header {
      background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 300;
      margin-bottom: 16px;
    }
    
    .header-subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 24px;
      color: #1F2937;
    }
    
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #4B5563;
      margin-bottom: 32px;
    }
    
    .otp-section {
      text-align: center;
      margin: 40px 0;
      padding: 32px;
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border-radius: 12px;
      border: 1px solid #BFDBFE;
    }
    
    .otp-label {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .otp-code {
      font-size: 42px;
      font-weight: 600;
      color: #1E40AF;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      margin-bottom: 16px;
      text-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }
    
    .otp-validity {
      font-size: 14px;
      color: #EF4444;
      font-weight: 500;
    }
    
    .instructions {
      background: #F9FAFB;
      padding: 24px;
      border-radius: 8px;
      border-left: 4px solid #3B82F6;
      margin: 32px 0;
    }
    
    .instructions h3 {
      font-size: 16px;
      color: #1F2937;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .instructions p {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 8px;
    }
    
    .footer {
      background: #F9FAFB;
      padding: 32px 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    
    .company-info {
      font-size: 12px;
      color: #9CA3AF;
    }
    
    .warning {
      background: #FEF3C7;
      border: 1px solid #F59E0B;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      font-size: 14px;
      color: #92400E;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        margin: 10px;
        border-radius: 12px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
      
      .footer {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NarzędziaDlaTwórców.pl</div>
      <div class="header-subtitle">Nowy kod weryfikacyjny</div>
    </div>
    
    <div class="content">
      <div class="greeting">Nowy kod weryfikacyjny 🔄</div>
      
      <div class="message">
        <p>Wygenerowano dla Ciebie nowy kod weryfikacyjny. Wprowadź go na stronie weryfikacji, aby dokończyć rejestrację.</p>
      </div>
      
      <div class="otp-section">
        <div class="otp-label">Twój nowy kod weryfikacyjny</div>
        <div class="otp-code">${otpCode}</div>
        <div class="otp-validity">⏰ Kod wygasa za 15 minut</div>
      </div>
      
      <div class="instructions">
        <h3>Instrukcje:</h3>
        <p>1. Wróć do strony weryfikacji</p>
        <p>2. Wprowadź powyższy 6-cyfrowy kod</p>
        <p>3. Kliknij "Zweryfikuj email"</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Bezpieczeństwo:</strong> Jeśli to nie Ty prosiłeś o nowy kod, zignoruj tę wiadomość. Kod weryfikacyjny wygaśnie automatycznie za 15 minut.
      </div>
    </div>
    
    <div class="footer">
      <div class="company-info">
        © 2025 NarzędziaDlaTwórców.pl<br>
        <a href="https://narzedziadlatworcow.pl/polityka-prywatnosci" style="color: #9CA3AF;">Polityka Prywatności</a> •
        <a href="https://narzedziadlatworcow.pl/regulamin" style="color: #9CA3AF;">Regulamin</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
