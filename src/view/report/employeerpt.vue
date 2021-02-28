<template>
  <div>
    <Card>
      <dz-table
        :totalCount="stores.record.query.totalCount"
        :pageSize="stores.record.query.pageSize"
        @on-page-change="handlePageChanged"
        @on-page-size-change="handlePageSizeChanged"
      >
        <div slot="searcher">
          <section class="dnc-toolbar-wrap">
            <Row :gutter="16">
              <Col span="16">
                <Form inline @submit.native.prevent>
                  <FormItem>
                    <Input
                      type="text"
                      search
                      :clearable="true"
                      v-model="stores.record.query.kw"
                      placeholder="输入软件产品关键字搜索..."
                      @on-search="handleSearchRecord()"
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.record.query.salesmanId"
                        placeholder="选择业务员"
                        @on-change="handleSearchRecord"
                        style="width: 150px"
                      >
                        <Option
                          v-for="(option, index) in salesmans"
                          :value="option.id"
                          :key="index"
                          >{{ option.text }}</Option
                        > </Select
                      ><DatePicker
                        slot="prepend"
                        type="date"
                        style="width: 165px"
                        placeholder="请选择日期"
                        size="small"
                        @on-change="handleSearchRecord"
                        v-model="stores.record.query.beginDate"
                      ></DatePicker>
                      <DatePicker
                        slot="prepend"
                        type="date"
                        style="width: 165px"
                        placeholder="请选择日期"
                        size="small"
                        @on-change="handleSearchRecord"
                        v-model="stores.record.query.endDate"
                      ></DatePicker>
                    </Input>
                  </FormItem>
                </Form>
              </Col>
              <Col span="8" class="dnc-toolbar-btns">
                <Button
                  v-can="'create'"
                  icon="md-download"
                  type="info"
                  @click="handleExport"
                  title="导出"
                  style="margin-right: 10px"
                  >导出</Button
                >
              </Col>
            </Row>
          </section>
        </div>
        <Table
          slot="table"
          ref="tables"
          :border="false"
          size="small"
          :highlight-row="true"
          :data="stores.record.data"
          :columns="stores.record.columns"
          @on-select="handleSelect"
          @on-selection-change="handleSelectionChange"
          @on-refresh="handleRefresh"
          :row-class-name="rowClsRender"
          @on-page-change="handlePageChanged"
          @on-page-size-change="handlePageSizeChanged"
          @on-sort-change="handleSortChange"
        >
        </Table>
      </dz-table>
    </Card>
  </div>
</template>

<script>
import DzTable from "_c/tables/dz-table.vue";
import { getReportList, exportData } from "@/api/report/employee.js";
import dayjs from "dayjs";
import { getAllSalesman } from "@/api/base/saleman";
import { b64toFile } from "@/libs/tools";
import { saveAs } from "file-saver";
export default {
  name: "employee_commision_report",
  components: {
    DzTable,
  },
  data() {
    return {
      formModel: {
        selection: [],
      },
      stores: {
        record: {
          query: {
            totalCount: 0,
            pageSize: 20,
            currentPage: 1,
            kw: "",
            isDeleted: 0,
            status: -1,
            salesmanId: -1,
            beginDate: dayjs()
              .add(-1, "year")
              .startOf("year")
              .format("YYYY-MM-DD"),
            endDate: dayjs().add(-1, "year").endOf("year").format("YYYY-MM-DD"),
            sort: [
              {
                direct: "DESC",
                field: "fSalesmanId",
              },
            ],
          },
          columns: [
            {
              title: "业务员",
              key: "fSalesmanName",
              align: "center",
              width: 120,
            },
            {
              title: "客户",
              key: "fCustomName",
              align: "center",
              width: 120,
            },
            {
              title: "软件产品",
              key: "fSoftwareName",
              align: "center",
              width: 150,
            },
            {
              title: "合同总金额",
              key: "fContractPrice",
              align: "center",
              width: 120,
            },
            {
              title: "模块标准价",
              key: "fStandardPrice",
              align: "right",
              width: 120,
            },
            {
              title: "提成金额",
              key: "fCommissionPrice",
              align: "right",
              width: 120,
            },
          ],
          data: [],
        },
      },
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },

      salesmans: [],
      defaultData: [{ id: -1, name: "全部", value: -1, text: "全部" }],
    };
  },
  computed: {
    selectedRows() {
      return this.formModel.selection;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.fId);
    },
  },
  methods: {
    initSalesman() {
      getAllSalesman({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.salesmans = this.defaultData.concat(data);
        }
      });
    },

    loadRecordList() {
      getReportList(
        Object.assign({}, this.stores.record.query, {
          beginDate: dayjs(this.stores.record.query.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: dayjs(this.stores.record.query.endDate).format("YYYY-MM-DD"),
        })
      ).then((res) => {
        this.stores.record.data = res.data.data;
        this.stores.record.query.totalCount = res.data.totalCount;
      });
    },
    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadRecordList();
    },

    handleSearchRecord() {
      this.loadRecordList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handleSortChange(column) {
      this.stores.record.query.sort.direction = column.order;
      this.stores.record.query.sort.field = column.key;
      this.loadPostList();
    },
    handlePageChanged(page) {
      this.stores.record.query.currentPage = page;
      this.loadRecordList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.record.query.pageSize = pageSize;
      this.loadRecordList();
    },
    handleExport() {
      exportData(
        Object.assign({}, this.stores.record.query, {
          beginDate: dayjs(this.stores.record.query.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: dayjs(this.stores.record.query.endDate).format("YYYY-MM-DD"),
        })
      ).then((response) => {
        const { data, state, msg } = response.data;
        if (state == "success") {
          const { filename, file } = data;
          let fileexcle = b64toFile(
            file,
            filename,
            "application/vnd.ms-excel;charset=utf-8"
          );
          saveAs(fileexcle, filename);
        } else {
          this.$Message.warning(msg);
        }
      });
    },
  },
  mounted() {
    this.loadRecordList();
    this.initSalesman();
  },
};
</script>

<style>
</style>
