export interface Props {
  src: string;
  alt?: string;
  optimized?: boolean;
}

export type ActualProps = Props &
  Omit<
    React.HTMLAttributes<HTMLPictureElement>,
    'src' | 'alt' | 'optimized'
  >;

export default async function ExternalPicture(
  props: ActualProps,
) {
  let PictureComponent;

  if (process.env.NODE_ENV === 'production') {
    PictureComponent =
      require('./ExternalPictureProduction').default;
  } else {
    PictureComponent =
      require('./ExternalPictureDevelopment').default;
  }

  return <PictureComponent {...props} />;
}
