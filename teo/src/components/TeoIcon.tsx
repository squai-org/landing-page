interface TeoIconProps {
  size: number;
}

const TeoIcon = ({ size }: Readonly<TeoIconProps>) => (
  <svg width={size} height={size} viewBox="0 0 500 500">
    <use href="#teo-icon" />
  </svg>
);

export default TeoIcon;
