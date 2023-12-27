import optimizeExternalImage from '../_lib/optimizeExternalImage';

interface Props {
  src: string;
  alt?: string;
  optimized?: boolean;
}

export default async function ExternalPicture(
  props: Props &
    Omit<
      React.HTMLAttributes<HTMLPictureElement>,
      'src' | 'alt' | 'optimized'
    >,
) {
  const { src, alt, ...parentProps } = props;

  if (!props.optimized) {
    return (
      <picture {...parentProps}>
        <img src={props.src} alt={props.alt} />
      </picture>
    );
  }

  const optimizedPcImages = await optimizeExternalImage(
    src,
    700,
    80,
  );

  // const optimizedSpImages = await optimizeExternalImage(
  //   src,
  //   400,
  //   80,
  // );

  return (
    <img src={optimizedPcImages.jpeg} alt={props.alt} />
    // <picture {...parentProps}>
    //   <source
    //     srcSet={optimizedPcImages.avif}
    //     type="image/avif"
    //   />
    //   <source
    //     srcSet={optimizedPcImages.webp}
    //     type="image/webp"
    //   />
    //   <img src={optimizedPcImages.jpeg} alt={props.alt} />
    // </picture>
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
