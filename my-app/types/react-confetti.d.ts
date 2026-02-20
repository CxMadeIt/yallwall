declare module 'react-confetti' {
  import * as React from 'react';
  
  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    run?: boolean;
    gravity?: number;
    wind?: number;
    colors?: string[];
    opacity?: number;
    style?: React.CSSProperties;
  }
  
  export default class Confetti extends React.Component<ConfettiProps> {}
}
