import { useMemo, useState, type MouseEvent } from 'react';
import {
  Badge,
  Box,
  CloseButton,
  Combobox,
  Group,
  Highlight,
  ScrollArea,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

import { findByCNCode, searchCBAMItems } from '../../data/cbamData';
import type { CBAMItem, CBAMSearchResult } from '../../data/cbamData';
import classes from '../../CBAMTaxEstimator.module.css';

type Props = {
  value: string;
  onChange: (payload: { cnCode: string; item: CBAMItem } | null) => void;
  limit?: number;
  placeholder?: string;
  getTaxPreview?: (item: CBAMItem) => number;
};

export function CBAMSearchCombobox({
  value,
  onChange,
  limit = 8,
  placeholder,
  getTaxPreview,
}: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 120);
  const searchResults = useMemo<CBAMSearchResult[]>(() => {
    const q = debouncedSearchValue.trim();

    if (q.length >= 2) {
      return searchCBAMItems(q, limit);
    }

    return [];
  }, [debouncedSearchValue, limit]);

  const trimmedSearchValue = debouncedSearchValue.trim();
  const nothingFound = trimmedSearchValue.length >= 2 && searchResults.length === 0;
  const highlight = debouncedSearchValue.trim();
  const canClear = searchValue.trim().length > 0 || value.trim().length > 0;

  const handleClearSearch = () => {
    setSearchValue('');
    onChange(null);
    combobox.resetSelectedOption();
    combobox.closeDropdown();
  };

  const handleSubmitValue = (value: string) => {
    const inList = searchResults.find((r) => r.cnCode === value);
    const item = inList?.item ?? findByCNCode(value);
    if (!item) return;

    onChange({ cnCode: item.cnCode, item });

    // 选中后：不清除选中结果\搜索列表，只清除当前搜索输入
    setSearchValue(item.cnCode);
    combobox.closeDropdown();
  };

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleSubmitValue}
      shadow="md"
      width="target"
      withinPortal={false}>
      <Combobox.Target>
        <TextInput
          value={searchValue}
          placeholder={placeholder}
          classNames={{
            root: classes.searchInputRoot,
            input: classes.searchInput,
            section: classes.searchInputSection,
          }}
          leftSection={<IconSearch size={16} />}
          rightSection={
            canClear ? (
              <CloseButton
                aria-label="Clear search"
                size={24}
                c="var(--mantine-color-dimmed)"
                onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                onClick={handleClearSearch}
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onChange={(e) => {
            const next = e.currentTarget.value;
            setSearchValue(next);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            setSearchValue(value || '');
            combobox.closeDropdown();
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown
        hidden={searchResults.length === 0 && !nothingFound}
        className={classes.searchDropdown}>
        <Combobox.Options>
          <ScrollArea.Autosize mah={300} type="always" scrollbarSize={6}>
            {nothingFound && <Combobox.Empty>未找到匹配的商品</Combobox.Empty>}

            {searchResults.map((r) => {
              const taxText =
                typeof getTaxPreview === 'function'
                  ? `税额: €${getTaxPreview(r.item).toFixed(2)}`
                  : '';

              return (
                <Combobox.Option
                  value={r.cnCode}
                  key={r.cnCode}
                  data-combobox-selected={value === r.cnCode || undefined}
                  className={classes.selectOption}
                  onMouseDown={(e: MouseEvent) => e.preventDefault()}>
                  <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    className={classes.autocompleteOption}>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Highlight highlight={highlight} className={classes.suggestionCode}>
                        {r.cnCode}
                      </Highlight>
                      <Box className={classes.suggestionDetails}>
                        <Highlight highlight={highlight} className={classes.suggestionProductName}>
                          {r.productName}
                        </Highlight>
                        <Highlight highlight={highlight} className={classes.suggestionMeta}>
                          {taxText ? `${r.category} | ${taxText}` : r.category}
                        </Highlight>
                      </Box>
                    </Box>
                    <Badge variant="outline" size="sm" style={{ flexShrink: 0 }}>
                      {r.category}
                    </Badge>
                  </Group>
                </Combobox.Option>
              );
            })}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
