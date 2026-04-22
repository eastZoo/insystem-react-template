import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.gray800} 0%,
    ${({ theme }) => theme.colors.gray700} 50%,
    ${({ theme }) => theme.colors.gray600} 100%
  );
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const LoginCard = styled.div`
  width: 100%;
  z-index: 10;
  overflow: hidden;
  position: relative;
  max-width: 40rem;
  background: ${({ theme }) => theme.colors.white100};
  box-shadow: ${({ theme }) => theme.shadows.modal};
  border-radius: 1rem;
`;

export const CardHeader = styled.div`
  padding: 2.5rem 2rem;
  text-align: center;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.gray800},
    ${({ theme }) => theme.colors.gray700}
  );
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: center;
`;

export const LogoBox = styled.div`
  width: 10rem;
  height: 7rem;
  display: flex;
  align-items: center;
  border-radius: 0.75rem;
  justify-content: center;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: 1.875rem;
`;

export const FormContainer = styled.form`
  padding: 2.5rem 2rem;
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  display: block;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const InputWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;

export const InputIcon = styled.div`
  left: 0.75rem;
  display: flex;
  position: absolute;
  align-items: center;
  pointer-events: none;

  svg {
    width: 2rem;
    color: ${({ theme }) => theme.colors.gray400};
    height: 2rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  outline: none;
  display: block;
  padding: 1.2rem 1.2rem 1.2rem 2.95rem;
  font-size: 1.5rem;
  transition: all 0.2s;
  border-radius: 0.5rem;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary100};
    border-color: transparent;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

export const OptionsRow = styled.div`
  display: flex;
  font-size: 0.875rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const CheckboxLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;

  input {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    accent-color: ${({ theme }) => theme.colors.primary100};
    border-radius: 0.25rem;
  }

  span {
    color: ${({ theme }) => theme.colors.gray600};
    margin-left: 0.5rem;
    font-size: 1.3rem;
  }
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary100};
  font-size: 1.3rem;
  transition: color 0.2s;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const LoginButton = styled.button<{ $isLoading?: boolean }>`
  width: 100%;
  color: ${({ theme }) => theme.colors.white100};
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0.75rem;
  font-size: 1.5rem;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.field};
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.primary100},
    ${({ theme }) => theme.colors.secondary100}
  );
  font-weight: 600;
  align-items: center;
  border-radius: 0.5rem;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.modal};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  svg {
    width: 2rem;
    height: 2rem;
  }

  .arrow {
    margin-left: 0.5rem;
  }

  .spinner {
    animation: spin 1s linear infinite;
    margin-right: 0.75rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const CardFooter = styled.div`
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  background-color: ${({ theme }) => theme.colors.gray50};

  p {
    color: ${({ theme }) => theme.colors.gray600};
    font-size: 1.3rem;
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.redStatus};
  border: 1px solid ${({ theme }) => theme.colors.redStatusBorder};
  padding: 0.75rem 1rem;
  font-size: 1.3rem;
  animation: slideDown 0.3s ease-out;
  text-align: center;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.redStatusLight};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
