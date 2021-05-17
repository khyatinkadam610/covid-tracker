import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
export const GlobalStyles = createGlobalStyle`
 
body{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    
  }
  

  `;
export const Themeddiv = styled.div`
background: ${({ theme }) => theme.body2};
display: flex;
flex-direction: column;
`;
