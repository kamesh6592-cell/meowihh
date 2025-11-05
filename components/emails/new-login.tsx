import * as React from 'react';
import { Html, Head, Body, Container, Section, Img, Text, Link, Hr } from '@react-email/components';

interface NewLoginEmailProps {
  userName: string;
  loginTime: string;
  ipAddress: string;
  location: string;
  browser: string;
}

const NewLoginEmail = (props: NewLoginEmailProps) => {
  const { userName, loginTime, ipAddress, location, browser } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={main}>
        <Container style={container}>
            {/* Logo */}
            <Section style={logoSection}>
              <Img 
                src="https://www.meow.ajstudioz.co.in/aj-logo.jpg" 
                alt="AJ" 
                width="48"
                height="48"
                style={logo}
              />
            </Section>          {/* Title */}
          <Section style={section}>
            <Text style={heading}>
              We've noticed a new login
            </Text>
            
            <Text style={paragraph}>
              Hi {userName},
            </Text>
            
            <Text style={paragraph}>
              This is a routine security alert. Someone logged into your AJ STUDIOZ account from a new IP address:
            </Text>
          </Section>

          {/* Login Details */}
          <Section style={detailsBox}>
            <Text style={detailItem}>
              <span style={detailLabel}>Time:</span> {loginTime}
            </Text>
            <Text style={detailItem}>
              <span style={detailLabel}>IP address:</span> {ipAddress}
            </Text>
            <Text style={detailItem}>
              <span style={detailLabel}>Location:</span> {location}
            </Text>
            <Text style={detailItem}>
              <span style={detailLabel}>Browser:</span> {browser}
            </Text>
          </Section>

          {/* Security Message */}
          <Section style={section}>
            <Text style={paragraph}>
              If this was you, you can ignore this alert. If you noticed any suspicious activity on your account, please{' '}
              <Link href="https://www.meow.ajstudioz.co.in/settings" style={link}>
                change your password
              </Link>
              {' '}and{' '}
              <Link href="https://www.meow.ajstudioz.co.in/settings" style={link}>
                enable two-factor authentication
              </Link>
              {' '}on your{' '}
              <Link href="https://www.meow.ajstudioz.co.in/settings" style={link}>
                account page.
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={section}>
            <Text style={signature}>
              So long, and thanks for all the fish,
            </Text>
            <Text style={signatureName}>
              The AJ STUDIOZ Team
            </Text>
          </Section>

          <Section style={section}>
            <Text style={footer}>
              © 2025 AJ STUDIOZ
            </Text>
          </Section>

          <Section style={section}>
            <Text style={footer}>
              For questions contact{' '}
              <Link href="mailto:support@ajstudioz.co.in" style={footerLink}>
                support@ajstudioz.co.in
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles matching xAI email template
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
};

const logoSection = {
  marginBottom: '32px',
};

const logo = {
  borderRadius: '4px',
};

const section = {
  marginBottom: '24px',
};

const heading = {
  fontSize: '32px',
  fontWeight: '600',
  color: '#000000',
  margin: '0 0 24px 0',
  lineHeight: '1.2',
};

const paragraph = {
  fontSize: '16px',
  color: '#000000',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const detailsBox = {
  margin: '24px 0',
};

const detailItem = {
  fontSize: '16px',
  color: '#000000',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const detailLabel = {
  fontWeight: '600',
};

const link = {
  color: '#0066cc',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const signature = {
  fontSize: '16px',
  color: '#000000',
  margin: '0 0 4px 0',
  lineHeight: '1.5',
};

const signatureName = {
  fontSize: '16px',
  color: '#000000',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.5',
};

const footer = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const footerLink = {
  color: '#6b7280',
  textDecoration: 'none',
};

NewLoginEmail.PreviewProps = {
  userName: 'TOMO ACADEMY',
  loginTime: 'Sun, 2 Nov 2025 04:06:55 +0000',
  ipAddress: '2409:40f4:3110:8187:8000::',
  location: 'Unknown city, IN',
  browser: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
};

export default NewLoginEmail;
