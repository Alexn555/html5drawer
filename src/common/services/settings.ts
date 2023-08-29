import { tables } from "../../Config/constants/settings";

export function setTableSource(tableColor: string) {
    const mainPath = '../../../resources/table/';
    const isDefault = tables[0].value === tableColor;
    const table = isDefault ? 'table' : `${tableColor}tab`;
    return `${mainPath}${table}.png`;
}