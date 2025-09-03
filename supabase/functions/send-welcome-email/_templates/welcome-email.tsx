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

interface WelcomeEmailProps {
  userName: string;
  websiteUrl: string;
}

export const WelcomeEmail = ({
  userName,
  websiteUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>🎉 Bem-vindo(a) ao Goya Community!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🌍 Bem-vindo(a) ao Goya Community!</Heading>
        
        <Text style={text}>
          Olá <strong>{userName}</strong>,
        </Text>
        
        <Text style={text}>
          Seja muito bem-vindo(a) à <strong>Goya Community</strong>, uma comunidade global 
          para compartilhar ideias e criações que transformam a programação, a ciência, 
          a medicina, a biologia e muito mais.
        </Text>
        
        <Text style={text}>
          A partir de agora você pode:
        </Text>
        
        <Section style={listSection}>
          <Text style={listItem}>✨ Criar seus próprios posts</Text>
          <Text style={listItem}>🔍 Explorar conteúdos inspiradores</Text>
          <Text style={listItem}>🤝 Conectar-se com pessoas que querem transformar o mundo</Text>
        </Section>
        
        <Section style={buttonSection}>
          <Button
            href={websiteUrl}
            style={button}
          >
            👉 Entrar no Goya Community
          </Button>
        </Section>
        
        <Text style={footer}>
          — Equipe Goya Community 🌍
        </Text>
        
        <Text style={disclaimer}>
          Se você não se cadastrou na plataforma, pode ignorar este email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const listSection = {
  margin: "20px 0",
  padding: "20px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
};

const listItem = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 10px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#4f46e5",
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