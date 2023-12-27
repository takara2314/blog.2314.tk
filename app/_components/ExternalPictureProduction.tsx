import AsyncLock from 'async-lock';
import optimizeExternalImage from '../_lib/optimizeExternalImage';
import { ActualProps } from './ExternalPicture';

const lock = new AsyncLock();

export default async function ExternalPicture(
  props: ActualProps,
) {
  const {
    src,
    alt,
    optimized = true,
    ...parentProps
  } = props;

  if (!optimized) {
    return (
      <picture {...parentProps}>
        <img src={props.src} alt={props.alt} />
      </picture>
    );
  }

  const optimizedPcImages = await lock.acquire(
    'optimize-external-image',
    async () => {
      return await optimizeExternalImage(src, 700, 70);
    },
  );

  // const optimizedSpImages = await lock.acquire(
  //   'optimize-external-image',
  //   async () => {
  //     return await optimizeExternalImage(src, 400, 70);
  //   },
  // );

  return (
    <picture {...parentProps}>
      <source
        srcSet={optimizedPcImages.avif}
        type="image/avif"
      />
      <source
        srcSet={optimizedPcImages.avif}
        type="image/webp"
      />
      <img src={optimizedPcImages.jpeg} alt={props.alt} />
    </picture>
  );

  // return (
  //   <picture {...parentProps}>
  //     <source
  //       srcSet={optimizedPcImages.avif}
  //       media="(min-width:700px)"
  //       type="image/avif"
  //     />
  //     <source
  //       srcSet={optimizedPcImages.webp}
  //       media="(min-width:700px)"
  //       type="image/webp"
  //     />
  //     <source
  //       srcSet={optimizedPcImages.jpeg}
  //       media="(min-width:700px)"
  //       type="image/jpeg"
  //     />
  //     <source
  //       srcSet={optimizedSpImages.avif}
  //       type="image/avif"
  //     />
  //     <source
  //       srcSet={optimizedSpImages.avif}
  //       type="image/webp"
  //     />
  //     <img src={optimizedSpImages.jpeg} alt={props.alt} />
  //   </picture>
  // );
}
