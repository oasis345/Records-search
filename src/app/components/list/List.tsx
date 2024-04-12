import { ListItem } from './ListItem';

export const List: React.FC<List> = ({
  items,
  keyField,
  valueField,
  imageField = '',
  imageOptions,
  classes,
  itemClasses,
  onItemClick,
}: List) => {
  return (
    <div className={classes}>
      {items.map((item) => (
        <ListItem
          key={item[keyField]}
          classes={itemClasses}
          item={item}
          value={item[valueField ?? keyField]}
          imageSrc={item[imageField]}
          imageOptions={imageOptions}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};
