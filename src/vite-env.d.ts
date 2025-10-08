/// <reference types="vite/client" />

declare module "*.css?raw" {
  const content: string;
  export default content;
}

declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare module '*.css' {
  import { CSSResult } from 'lit';
  const styles: CSSResult;
  export default styles;
}
