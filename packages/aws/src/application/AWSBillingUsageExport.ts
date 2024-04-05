import { CloudProviderAccount } from '@cloud-carbon-footprint/core'
import { EstimationResult, GroupBy } from '@cloud-carbon-footprint/common'
import csv from 'csvtojson'

type UsageBillingRow = {
  RecordType: string
  ProductName: string
  UsageType: string
  UsageStartDate: Date
  UsageEndDate: Date
  UsageQuantity: number
}

const convertToDate = (date: string): Date => new Date(date)

const RECORD_TYPE_PAYER_LINE_ITEM = 'PayerLineItem'
// const RECORD_TYPE_LINKED_LINE_ITEM = 'LinkedLineItem'
const USE_RECORD_TYPE = RECORD_TYPE_PAYER_LINE_ITEM

export default class AWSBillingUsageExport extends CloudProviderAccount {
  private readonly filePath: string

  constructor(filePath: string) {
    super()
    this.filePath = filePath
  }

  protected async getData(): Promise<UsageBillingRow[]> {
    const data: UsageBillingRow[] = await csv({
      colParser: {
        InvoiceID: 'omit',
        PayerAccountId: 'omit',
        LinkedAccountId: 'omit',
        RecordType: 'string',
        RecordID: 'omit',
        BillingPeriodStartDate: 'omit',
        BillingPeriodEndDate: 'omit',
        InvoiceDate: 'omit',
        PayerAccountName: 'omit',
        LinkedAccountName: 'omit',
        TaxationAddress: 'omit',
        PayerPONumber: 'omit',
        ProductCode: 'omit',
        ProductName: 'string',
        SellerOfRecord: 'omit',
        UsageType: 'string',
        Operation: 'omit',
        RateId: 'omit',
        ItemDescription: 'omit',
        UsageStartDate: convertToDate,
        UsageEndDate: convertToDate,
        UsageQuantity: 'number',
        BlendedRate: 'omit',
        CurrencyCode: 'omit',
        CostBeforeTax: 'omit',
        Credits: 'omit',
        TaxAmount: 'omit',
        TaxType: 'omit',
        TotalCost: 'omit',
      },
    }).fromFile(this.filePath)
    return data.filter((row) => row.RecordType === USE_RECORD_TYPE)
  }

  async getDataFromCSV(
    startDate: Date,
    endDate: Date,
    grouping: GroupBy,
  ): Promise<EstimationResult[]> {
    const data = await this.getData()

    return []
  }
}
