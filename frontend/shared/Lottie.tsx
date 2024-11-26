import {FC, memo} from 'react';
import {DotLottieReact, DotLottieReactProps} from "@lottiefiles/dotlottie-react";

export const Lottie: FC<DotLottieReactProps> = memo((props) => {
  return (
    <DotLottieReact {...props} autoplay/>
  );
});