export interface DateFilter {
  date?: {
    gte?: Date;
    lte?: Date;
  };
  dateTime?: {
    gte?: Date;
    lte?: Date;
  };
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface TypeFilter {
  type?: string;
}
