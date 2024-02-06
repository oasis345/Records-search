import Image from 'next/image';

export const ListItem: React.FC<ListItem> = ({ item, value, classes, imageSrc, imageOptions, onClick }) => {
  return (
    <div className={classes ?? 'flex'} onClick={() => onClick?.(item)} style={{ cursor: onClick ? 'pointer' : '' }}>
      {(imageSrc ?? imageOptions?.getImageSrc(item)) && imageOptions && (
        <Image
          width={imageOptions?.size}
          height={imageOptions?.size}
          src={imageSrc ?? imageOptions?.getImageSrc(item)}
          alt="List Item Image"
        />
      )}
      <p>{value}</p>
    </div>
  );
};
