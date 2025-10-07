import React from 'react';
import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text } from '@react-email/components';

type ContactFormEmailProps = {
  senderName: string;
  senderEmail: string;
  message: string;
};

export function ContactFormEmail({ senderName, senderEmail, message }: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from your ShapeAI contact form</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', border: '1px solid #eee', borderRadius: '5px', margin: '40px auto', padding: '40px', maxWidth: '600px' }}>
          <Section>
            <Heading style={{ color: '#333', fontSize: '24px' }}>
              You received a new message!
            </Heading>
            <Text style={{ color: '#555', fontSize: '16px' }}>
              From: <strong>{senderName}</strong>
            </Text>
            <Text style={{ color: '#555', fontSize: '16px' }}>
              Email: <strong>{senderEmail}</strong>
            </Text>
            <Hr style={{ borderColor: '#ddd', margin: '20px 0' }} />
            <Heading as="h2" style={{ color: '#444', fontSize: '20px' }}>Message:</Heading>
            <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}