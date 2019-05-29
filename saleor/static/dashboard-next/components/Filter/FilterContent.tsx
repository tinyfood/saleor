import Button from "@material-ui/core/Button";
import * as React from "react";

import { makeStyles } from "@material-ui/styles";
import i18n from "../../i18n";
import { getMenuItemByValue, isLeaf, walkToRoot } from "../../utils/menu";
import FormSpacer from "../FormSpacer";
import SingleSelectField from "../SingleSelectField";
import FilterElement from "./FilterElement";
import { IFilter } from "./types";

export interface FilterContentSubmitData {
  name: string;
  value: string | string[];
}
export interface FilterContentProps {
  filters: IFilter;
  onSubmit: (data: FilterContentSubmitData) => void;
}

function checkFilterValue(value: string | string[]): boolean {
  if (typeof value === "string") {
    return value !== "";
  }
  return value.every(v => !!v);
}

const useStyles = makeStyles({
  input: {
    padding: "20px 12px 17px"
  }
});

const FilterContent: React.FC<FilterContentProps> = ({ filters, onSubmit }) => {
  const [menuValue, setMenuValue] = React.useState<string>("");
  const [filterValue, setFilterValue] = React.useState<string | string[]>("");
  const classes = useStyles();

  const activeMenu = menuValue
    ? getMenuItemByValue(filters, menuValue)
    : undefined;
  const menus = menuValue
    ? walkToRoot(filters, menuValue).slice(-1)
    : undefined;

  const onMenuChange = (event: React.ChangeEvent<any>) => {
    setMenuValue(event.target.value);
    setFilterValue("");
  };

  return (
    <>
      <SingleSelectField
        choices={filters.map(filterItem => ({
          label: filterItem.label,
          value: filterItem.value
        }))}
        onChange={onMenuChange}
        selectProps={{
          classes: {
            selectMenu: classes.input
          }
        }}
        value={menus ? menus[0].value : menuValue}
        placeholder={i18n.t("Select Filter...")}
      />
      {menus &&
        menus.map(
          (filterItem, filterItemIndex) =>
            !isLeaf(filterItem) && (
              <>
                <FormSpacer />
                <SingleSelectField
                  choices={filterItem.children.map(filterItem => ({
                    label: filterItem.label,
                    value: filterItem.value
                  }))}
                  onChange={onMenuChange}
                  selectProps={{
                    classes: {
                      selectMenu: classes.input
                    }
                  }}
                  value={
                    filterItemIndex === menus.length - 1
                      ? menuValue
                      : menus[filterItemIndex - 1].label.toString()
                  }
                  placeholder={i18n.t("Select Filter...")}
                />
              </>
            )
        )}
      {activeMenu && isLeaf(activeMenu) && (
        <>
          <FormSpacer />
          <FilterElement
            filter={activeMenu}
            value={filterValue}
            onChange={value => setFilterValue(value)}
          />
          {checkFilterValue(filterValue) && (
            <>
              <FormSpacer />
              <Button
                color="primary"
                onClick={() =>
                  onSubmit({
                    name: activeMenu.value,
                    value: filterValue
                  })
                }
              >
                {i18n.t("Add filter")}
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
};
FilterContent.displayName = "FilterContent";
export default FilterContent;