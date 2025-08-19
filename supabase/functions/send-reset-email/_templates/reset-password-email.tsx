import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface ResetPasswordEmailProps {
  resetUrl: string;
  userName: string;
}

export const ResetPasswordEmail = ({
  resetUrl,
  userName,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>🔒 Recuperação de senha — Goya Communit</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔒 Recuperação de Senha</Heading>
        
        <Text style={text}>
          Olá <strong>{userName}</strong>,
        </Text>
        
        <Text style={text}>
          Recebemos um pedido para redefinir sua senha na <strong>Goya Communit</strong>.
        </Text>
        
        <Text style={text}>
          Se você realmente fez essa solicitação, clique no botão abaixo para criar uma nova senha:
        </Text>
        
        <Section style={buttonSection}>
          <Button
            href={resetUrl}
            style={button}
          >
            🔑 Redefinir Senha
          </Button>
        </Section>
        
        <Text style={text}>
          Ou copie e cole este link no seu navegador:
        </Text>
        
        <Link href={resetUrl} style={link}>
          {resetUrl}
        </Link>
        
        <Section style={warningSection}>
          <Text style={warningText}>
            ⚠️ <strong>Importante:</strong> Este link expira em 1 hora por motivos de segurança.
          </Text>
        </Section>
        
        <Text style={text}>
          Se não foi você quem solicitou esta recuperação, basta ignorar este email. 
          Sua senha permanecerá inalterada.
        </Text>
        
        <Text style={footer}>
          — Equipe Goya Communit 🌍
        </Text>
        
        <Text style={disclaimer}>
          Por segurança, nunca compartilhe este email com outras pessoas.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "12px",
  margin: "40px auto",
  padding: "40px",
  width: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 30px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#dc2626",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1",
  padding: "12px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const link = {
  color: "#4f46e5",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const warningSection = {
  backgroundColor: "#fef3cd",
  border: "1px solid #fbbf24",
  borderRadius: "8px",
  margin: "20px 0",
  padding: "16px",
};

const warningText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const footer = {
  color: "#666666",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1.6",
  margin: "30px 0 20px 0",
  textAlign: "center" as const,
};

const disclaimer = {
  color: "#999999",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "20px 0 0 0",
  textAlign: "center" as const,
};