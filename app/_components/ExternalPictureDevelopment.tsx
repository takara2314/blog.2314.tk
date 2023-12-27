import { ActualProps } from './ExternalPicture';

export default async function ExternalPicture(
  props: ActualProps,
) {
  const {
    src,
    alt,
    optimized = true,
    ...parentProps
  } = props;

  return (
    <picture {...parentProps}>
      <img src={props.src} alt={props.alt} />
    </picture>
  );
}
