interface List {
  items: any[];
  keyField: string;
  valueField?: string;
  imageField?: string;
  imageOptions?: ImageOptions;
  classes?: string;
  itemClasses?: string;
  onItemClick?: (item: any) => void;
}

interface ListItem {
  item: any;
  value: any;
  imageSrc?: string;
  imageOptions?: ImageOptions;
  classes?: string;
  onClick?: (item: any) => void;
}

type ImageOptions = {
  getImageSrc: (item: any) => string;
  size: number;
};
