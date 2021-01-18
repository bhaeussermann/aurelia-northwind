export class SortService {
  sortedColumn: string;
  sortOrder: SortOrder;

  toggleColumn(columnName: string) {
    if (this.sortedColumn === columnName) {
      this.sortOrder = this.sortOrder === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    } else {
      this.sortedColumn = columnName;
      this.sortOrder = SortOrder.Ascending;
    }
  }
}

export enum SortOrder {
  Ascending, Descending
}
