import { useCallback, useMemo, useState } from 'react';
import { Badge, Box, Checkbox, Group, Text, TextInput, Title, UnstyledButton } from '@mantine/core';
import {
  IconCalculator,
  IconChevronRight,
  IconFileText,
  IconInfoCircle,
} from '@tabler/icons-react';

import { CBAMSearchCombobox } from './components/CBAMSearchCombobox';
import { getCategories, getProductName } from './data/cbamData';
import type { CBAMItem } from './data/cbamData';
import classes from './CBAMTaxEstimator.module.css';

const DEFAULT_CARBON_PRICE = 80;
const TAXABLE_FACTOR = 0.975;

const parsePositiveNumber = (raw: string): number | null => {
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value) || !Number.isFinite(value) || value <= 0) return null;
  return value;
};

const parseNonNegativeNumber = (raw: string): number | null => {
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) return null;
  return value;
};

// CBAM默认值法公式：（默认值2026mark-up/t - 默认值法对应基准值/t × 97.5%）× 碳价
const calculateDefaultTax = (item: CBAMItem, carbonPrice: number) => {
  const taxableCarbon = Math.max(
    0,
    item.defaultMarkup2026 - item.defaultBenchmark * TAXABLE_FACTOR
  );
  return taxableCarbon * carbonPrice;
};

// CBAM实际排放值法公式：（自定义实际值 - 实际值对应基准值/t × 97.5%）× 碳价
const calculateActualTax = (item: CBAMItem, actualValue: number, carbonPrice: number) => {
  const taxableCarbon = Math.max(0, actualValue - item.actualBenchmark * TAXABLE_FACTOR);
  return taxableCarbon * carbonPrice;
};

const CBAM_CONTACT_STORAGE_KEY = 'cbam_form_submitted';

const hasCBAMContactSubmitted = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(CBAM_CONTACT_STORAGE_KEY) === 'true';
};

const openCBAMContactModal = async (options?: { category?: string }) => {
  void options;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CBAM_CONTACT_STORAGE_KEY, 'true');
  }

  return true;
};

export function CBAMTaxEstimator() {
  const [selectedItem, setSelectedItem] = useState<CBAMItem | null>(null);
  const [customCarbonPrice, setCustomCarbonPrice] = useState<string>(String(DEFAULT_CARBON_PRICE));
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [userActualValue, setUserActualValue] = useState<string>('');
  const [useActualValue, setUseActualValue] = useState(false);
  const [hasContactSubmitted, setHasContactSubmitted] = useState(hasCBAMContactSubmitted);
  const isClient = typeof window !== 'undefined';

  const selectedCnCode = selectedItem?.cnCode ?? '';

  // 处理 checkbox 点击逻辑
  const handleActualValueCheckboxChange = useCallback(
    async (checked: boolean) => {
      if (checked) {
        // 如果用户要勾选，首先检查是否已经提交过
        if (hasContactSubmitted) {
          // 已经提交过，直接勾选
          setUseActualValue(true);
        } else {
          // 没有提交过，需要先弹出联系模态框
          const submitted = await openCBAMContactModal({
            category: selectedItem ? getProductName(selectedItem.cnCode) : undefined,
          });

          if (submitted) {
            // 成功提交后，自动勾选并更新状态
            setUseActualValue(true);
            setHasContactSubmitted(true);
          } else {
            // 用户取消了模态框或提交失败，不勾选
            setUseActualValue(false);
          }
        }
      } else {
        // 取消勾选
        setUseActualValue(false);
        setUserActualValue('');
      }
    },
    [hasContactSubmitted, selectedItem]
  );

  const categories = useMemo(() => getCategories(), []);

  const currentCarbonPrice = useMemo(() => {
    if (!useCustomPrice) return DEFAULT_CARBON_PRICE;
    const parsed = customCarbonPrice ? parsePositiveNumber(customCarbonPrice) : null;
    return parsed ?? DEFAULT_CARBON_PRICE;
  }, [customCarbonPrice, useCustomPrice]);

  const parsedActualValue = useMemo(() => {
    if (!useActualValue) return null;
    if (!userActualValue) return null;
    return parseNonNegativeNumber(userActualValue);
  }, [useActualValue, userActualValue]);

  const defaultTaxAmount = useMemo(() => {
    if (!selectedItem) return null;
    return calculateDefaultTax(selectedItem, currentCarbonPrice);
  }, [currentCarbonPrice, selectedItem]);

  const userActualTaxAmount = useMemo(() => {
    if (!selectedItem) return null;
    if (parsedActualValue === null) return null;
    return calculateActualTax(selectedItem, parsedActualValue, currentCarbonPrice);
  }, [currentCarbonPrice, parsedActualValue, selectedItem]);

  const isDefaultRecommended = useMemo(() => {
    if (defaultTaxAmount === null || userActualTaxAmount === null) return false;
    return userActualTaxAmount > defaultTaxAmount;
  }, [defaultTaxAmount, userActualTaxAmount]);

  const defaultTaxableCarbon = useMemo(() => {
    if (!selectedItem) return null;
    return Math.max(
      0,
      selectedItem.defaultMarkup2026 - selectedItem.defaultBenchmark * TAXABLE_FACTOR
    );
  }, [selectedItem]);

  const actualTaxableCarbon = useMemo(() => {
    if (!selectedItem) return null;
    if (parsedActualValue === null) return null;
    return Math.max(0, parsedActualValue - selectedItem.actualBenchmark * TAXABLE_FACTOR);
  }, [parsedActualValue, selectedItem]);

  const taxDiff = useMemo(() => {
    if (defaultTaxAmount === null || userActualTaxAmount === null) return null;
    return userActualTaxAmount - defaultTaxAmount;
  }, [defaultTaxAmount, userActualTaxAmount]);

  return (
    <Box className={classes.root}>
      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.headerContent}>
          <Box ta="center">
            <Title order={1} className={classes.headerTitle}>
              一键查询CBAM商品2026年应缴税额
            </Title>
            <Text className={classes.headerDesc}>
              输入CN编码，快速查询CBAM商品的默认值、实际值和预估税额信息
            </Text>
          </Box>
        </Box>
      </Box>

      <Box className={classes.mainContent}>
        {/* Search Section */}
        <Box className={classes.searchCard}>
          <Box className={classes.cardTitle}>CBAM商品查询</Box>
          <Text className={classes.cardDesc}>支持CN编码和商品名称搜索（输入2个字符开始提示）</Text>

          <Box>
            <CBAMSearchCombobox
              value={selectedCnCode}
              placeholder="请输入CN编码或商品名称，如：26011200 / 水泥"
              onChange={(payload) => {
                if (payload) {
                  setSelectedItem(payload.item);
                } else {
                  setSelectedItem(null);
                }
              }}
              getTaxPreview={(item) => calculateDefaultTax(item, DEFAULT_CARBON_PRICE)}
            />

            {/* Custom price section */}
            <Box className={classes.customPriceSection}>
              <Checkbox
                size="xs"
                color="blue"
                checked={useCustomPrice}
                onChange={(e) => setUseCustomPrice(e.currentTarget.checked)}
                classNames={{
                  root: classes.customPriceCheckboxRoot,
                  body: classes.customPriceCheckboxBody,
                  input: classes.customPriceCheckboxInput,
                  icon: classes.customPriceCheckboxIcon,
                }}
                label={<span className={classes.checkboxLabel}>使用自定义碳价计算</span>}
              />
              {useCustomPrice && (
                <Box className={classes.priceInputRow}>
                  <Text className={classes.priceInputLabel}>碳价：</Text>
                  <TextInput
                    type="number"
                    placeholder={String(DEFAULT_CARBON_PRICE)}
                    value={customCarbonPrice}
                    onChange={(e) => setCustomCarbonPrice(e.target.value)}
                    className={classes.priceInput}
                    classNames={{ input: classes.priceInputControl }}
                    min={0}
                    step={0.01}
                  />
                  <Text className={classes.priceInputLabel}>€/tCO2e</Text>
                  <Text className={classes.priceInputHint}>
                    （默认：€{DEFAULT_CARBON_PRICE}/tCO2e）
                  </Text>
                </Box>
              )}
            </Box>

            {/* Actual value section */}
            <Box className={classes.actualValueSection} style={{display:'none'}}>
              <Checkbox
                checked={useActualValue}
                onChange={(e) => {
                  handleActualValueCheckboxChange(e.currentTarget.checked);
                }}
                label={
                  <Group display="inline-flex" align="center" gap={4}>
                    <span className={classes.checkboxLabel}>使用自定义实际值计算</span>
                    {isClient && !hasContactSubmitted && (
                      <Badge component="span" color="orange" variant="light" size="sm">
                        需留资
                      </Badge>
                    )}
                  </Group>
                }
              />
              {useActualValue && (
                <Box>
                  <Box className={classes.priceInputRow}>
                    <Text className={classes.priceInputLabel}>企业每吨产品的实际排放值：</Text>
                    <TextInput
                      type="number"
                      placeholder={
                        selectedItem ? selectedItem.equivalentActualValue.toFixed(3) : '0.000'
                      }
                      value={userActualValue}
                      onChange={(e) => setUserActualValue(e.target.value)}
                      w={128}
                      min={0}
                      step={0.001}
                    />
                    <Text className={classes.priceInputLabel}>t</Text>
                  </Box>
                  <Text className={classes.actualValueHint}>
                    输入您企业每吨产品的实际排放值，系统将计算相应的CBAM税额
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Search Results */}
        {selectedItem && (
          <Box className={classes.resultsSection}>
            {/* Tax Info Card */}
            <Box className={classes.resultCard}>
              <Box className={classes.resultCardTitle}>
                <Box className={classes.resultCardTitleText}>
                  <IconCalculator size={20} />
                  2026年应缴税额信息
                </Box>
                <UnstyledButton
                  className={classes.resultCardAction}
                  type="button"
                  c="brand"
                  fw="normal"
                  onClick={() => openCBAMContactModal({ category: selectedItem.category })}>
                  <span>如需了解产品最优税费方案，欢迎即刻联系我们</span>
                  <IconChevronRight size={18} />
                </UnstyledButton>
              </Box>

              {/* Tax comparison display */}
              {useActualValue && parsedActualValue !== null ? (
                <Box>
                  <Box className={classes.taxComparisonGrid}>
                    {/* Default method result */}
                    <Box
                      className={`${classes.taxComparisonCard} ${
                        isDefaultRecommended
                          ? classes.taxComparisonCardRecommended
                          : classes.taxComparisonCardDefault
                      }`}>
                      <Box className={classes.taxComparisonHeader}>
                        <Text className={classes.taxComparisonTitle}>默认值法结果</Text>
                        {isDefaultRecommended && (
                          <span className={classes.recommendedTag}>推荐</span>
                        )}
                      </Box>
                      <Text
                        className={
                          isDefaultRecommended ? classes.taxAmountGreen : classes.taxAmountGray
                        }>
                        €{(defaultTaxAmount ?? 0).toFixed(2)}{' '}
                        <Text component="span" fz={14} ml={6} c="#6b7280">
                          /吨产品
                        </Text>
                      </Text>
                      {/* 默认值法计算公式 */}
                      <Box className={classes.calculationFormula}>
                        <Text className={classes.formulaLabel}>计算公式：</Text>
                        <Text className={classes.formulaText}>
                          (默认值2026mark-up - 默认值法基准值 × 97.5%) × 碳价
                        </Text>
                        <Text className={classes.formulaText}>
                          = ({selectedItem.defaultMarkup2026.toFixed(3)} -{' '}
                          {selectedItem.defaultBenchmark.toFixed(3)} × 97.5%) × €
                          {currentCarbonPrice}
                        </Text>
                        <Text className={classes.formulaText}>
                          = ({selectedItem.defaultMarkup2026.toFixed(3)} -{' '}
                          {(selectedItem.defaultBenchmark * TAXABLE_FACTOR).toFixed(3)}) × €
                          {currentCarbonPrice}
                        </Text>
                        <Text className={classes.formulaText}>
                          = {(defaultTaxableCarbon ?? 0).toFixed(3)} × €{currentCarbonPrice}
                        </Text>
                        <Text className={classes.formulaText}>
                          = €{(defaultTaxAmount ?? 0).toFixed(2)}
                        </Text>
                      </Box>
                    </Box>

                    {/* User actual value result */}
                    <Box
                      className={`${classes.taxComparisonCard} ${
                        !isDefaultRecommended
                          ? classes.taxComparisonCardActive
                          : classes.taxComparisonCardHigher
                      }`}>
                      <Box className={classes.taxComparisonHeader}>
                        <Text className={classes.taxComparisonTitle}>您的实际排放值结果</Text>
                        {!isDefaultRecommended && <span className={classes.activeTag}>使用中</span>}
                      </Box>
                      <Text
                        className={
                          !isDefaultRecommended ? classes.taxAmountBlue : classes.taxAmountRed
                        }>
                        €{(userActualTaxAmount ?? 0).toFixed(2)}
                        <Text component="span" fz={14} ml={6} c="#6b7280">
                          /吨产品
                        </Text>
                      </Text>
                      {/* 用户实际值计算公式 */}
                      <Box className={classes.calculationFormula}>
                        <Text className={classes.formulaLabel}>计算公式：</Text>
                        <Text className={classes.formulaText}>
                          (自定义实际值 - 实际值对应基准值 × 97.5%) × 碳价
                        </Text>
                        <Text className={classes.formulaText}>
                          = ({parsedActualValue.toFixed(3)} -{' '}
                          {selectedItem.actualBenchmark.toFixed(3)} × 97.5%) × €{currentCarbonPrice}
                        </Text>
                        <Text className={classes.formulaText}>
                          = ({parsedActualValue.toFixed(3)} -{' '}
                          {(selectedItem.actualBenchmark * TAXABLE_FACTOR).toFixed(3)}) × €
                          {currentCarbonPrice}
                        </Text>
                        <Text className={classes.formulaText}>
                          = {(actualTaxableCarbon ?? 0).toFixed(3)} × €{currentCarbonPrice}
                        </Text>
                        <Text className={classes.formulaText}>
                          = €{(userActualTaxAmount ?? 0).toFixed(2)}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Warning message */}
                  {isDefaultRecommended && (
                    <Box className={classes.warningBox}>
                      <Box className={classes.warningContent}>
                        <IconInfoCircle size={16} className={classes.warningIcon} />
                        <Box>
                          <Text className={classes.warningText}>
                            因您录入的实际值导致应缴税额大于采用默认值法的应缴税额，此处建议使用默认值法的计算结论。
                          </Text>
                          <Text className={classes.warningDiff}>
                            税额差异：€
                            {(taxDiff ?? 0).toFixed(2)}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  <Text className={classes.carbonPriceNote}>
                    （参考值，基于€{currentCarbonPrice}/tCO2e碳价）
                  </Text>
                </Box>
              ) : (
                /* Single result display (when no actual value entered) */
                <Box className={classes.singleTaxResult}>
                  <Text className={classes.resultLabel}>预估CBAM税额（基于默认值）</Text>
                  <Text className={classes.singleTaxAmount}>
                    €{(defaultTaxAmount ?? 0).toFixed(2)}{' '}
                    <Text component="span" fz={14} ml={6} c="#6b7280">
                      /吨产品
                    </Text>
                  </Text>
                  <Text className={classes.singleTaxNote}>
                    （参考值，基于€{currentCarbonPrice}/tCO2e碳价）
                  </Text>
                  {/* 单一结果计算公式 */}
                  <Box className={classes.singleCalculationFormula}>
                    <Text className={classes.singleFormulaLabel}>计算公式：</Text>
                    <Text className={classes.singleFormulaText}>
                      (默认值2026mark-up - 默认值法基准值 × 97.5%) × 碳价
                    </Text>
                    <Text className={classes.singleFormulaText}>
                      = ({selectedItem.defaultMarkup2026.toFixed(3)} -{' '}
                      {selectedItem.defaultBenchmark.toFixed(3)} × 97.5%) × €{currentCarbonPrice}
                    </Text>
                    <Text className={classes.singleFormulaText}>
                      = ({selectedItem.defaultMarkup2026.toFixed(3)} -{' '}
                      {(selectedItem.defaultBenchmark * TAXABLE_FACTOR).toFixed(3)}) × €
                      {currentCarbonPrice}
                    </Text>
                    <Text className={classes.singleFormulaText}>
                      = {(defaultTaxableCarbon ?? 0).toFixed(3)} × €{currentCarbonPrice}
                    </Text>
                    <Text className={classes.singleFormulaTextBold}>
                      = €{(defaultTaxAmount ?? 0).toFixed(2)}
                    </Text>
                  </Box>
                  {useCustomPrice && (
                    <Text className={classes.customPriceUsed}>✓ 使用自定义碳价计算</Text>
                  )}
                </Box>
              )}
            </Box>

            {/* Basic Info Card */}
            <Box className={classes.resultCard}>
              <Box className={classes.resultCardHeader}>
                <Box className={classes.resultCardTitle}>
                  <IconFileText size={20} />
                  查询结果
                </Box>
                <Badge variant="light">{selectedItem.category}</Badge>
              </Box>

              <Box className={classes.resultGrid}>
                <Box className={classes.resultItem}>
                  <Text className={classes.resultLabel}>CN编码</Text>
                  <Text className={`${classes.resultValue} ${classes.resultValueBlue}`}>
                    {selectedItem.cnCode}
                  </Text>
                </Box>
                <Box className={classes.resultItem}>
                  <Text className={classes.resultLabel}>产品名称</Text>
                  <Text className={classes.resultValueLarge}>
                    {getProductName(selectedItem.cnCode)}
                  </Text>
                </Box>
                <Box className={classes.resultItem}>
                  <Text className={classes.resultLabel}>商品类别</Text>
                  <Text className={classes.resultValueLarge}>{selectedItem.category}</Text>
                </Box>
                {/* <Box className={classes.resultItem}>
                  <Text className={classes.resultLabel}>临界值</Text>
                  <Text className={`${classes.resultValue} ${classes.resultValueGreen}`}>
                    {selectedItem.equivalentActualValue.toFixed(3)} t
                  </Text>
                  <Text className={classes.resultHint}>
                    若产品实际排放高于此数值，则在2026年，使用默认值法的应缴税额更低。
                  </Text>
                </Box> */}
              </Box>
            </Box>

            {/* Calculation Note */}
            <Box className={classes.calculationNote}>
              <Box className={classes.noteContent}>
                <IconInfoCircle size={16} className={classes.noteIcon} />
                <Text className={classes.noteText}>
                  <span className={classes.noteTextBold}>注：</span>
                  当缺省值或基准值有多个时，均采用欧盟所列第一种情形，即默认采用[1]、[C]、[F]，如钢铁类产品默认选[C]，对应为生产采用了高炉
                  - 转炉（BF-BOF）工艺。
                </Text>
              </Box>
            </Box>

            {/* Details Toggle */}
            {/* <Box className={classes.detailsToggle}>
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                leftSection={<IconInfoCircle size={16} />}>
                {showDetails ? '隐藏详细信息' : '查看详细信息'}
              </Button>
            </Box> */}
          </Box>
        )}

        {/* Categories Overview */}
        {!selectedItem && (
          <Box className={classes.categoriesCard}>
            <Title order={3} className={classes.categoriesTitle}>
              支持的商品类别
            </Title>
            <Text className={classes.categoriesDesc}>本系统支持以下CBAM商品类别的查询</Text>

            <Box className={classes.categoriesList}>
              {categories.map((category) => (
                <Badge key={category} variant="outline" size="lg">
                  {category}
                </Badge>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
