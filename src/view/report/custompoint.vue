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
                      class="iptSearch"
                      enter-button="搜索"
                      :clearable="true"
                      v-model="stores.record.query.kw"
                      @on-search="handleSearchRecord"
                      placeholder="输入软件产品关键字搜索..."
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.record.query.customId"
                        clearable
                        filterable
                        placeholder="请选择客户"
                        style="width: 150px"
                      >
                        <Option
                          v-for="(option, index) in customs"
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
                        v-model="stores.record.query.beginDate"
                      ></DatePicker>
                      <DatePicker
                        slot="prepend"
                        type="date"
                        style="width: 165px"
                        placeholder="请选择日期"
                        size="small"
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
import { getReportList, exportData } from "@/api/report/points.js";
import dayjs from "dayjs";
import { getAllCustom } from "@/api/base/custom";
import { b64toFile } from "@/libs/tools";
import { saveAs } from "file-saver";
import NP from "number-precision";
export default {
  name: "custom_point_report",
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
            customId: -1,
            beginDate: dayjs().startOf("year").format("YYYY-MM-DD"),
            endDate: dayjs().endOf("year").format("YYYY-MM-DD"),
            sort: [
              {
                direct: "DESC",
                field: "fPonits",
              },
            ],
          },
          columns: [
            {
              title: "客户编码",
              key: "fCustomCode",
              align: "center",
              width: 120,
            },
            {
              title: "客户名称",
              key: "fCustomName",
              align: "center",
              width: 120,
            },
            {
              title: "积分",
              key: "fPoints",
              align: "right",
              width: 120,
              sort: true,
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

      customs: [],
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
    initCustom() {
      getAllCustom({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.customs = this.defaultData.concat(data);
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
        let temp = res.data.data;
        let result = [];
        let obj = {};
        temp.forEach((ele) => {
          if (obj[ele.fCustomId]) {
            obj[ele.fCustomId]["fPoints"] = NP.plus(
              obj[ele.fCustomId]["fPoints"],
              ele.fPoints
            );
          } else {
            obj[ele.fCustomId] = {};
            obj[ele.fCustomId]["fCustomId"] = ele.fCustomId;
            obj[ele.fCustomId]["fCustomCode"] = ele.fCustomCode;
            obj[ele.fCustomId]["fCustomName"] = ele.fCustomName;
            obj[ele.fCustomId]["fPoints"] = ele.fPoints;
          }
        });
        for (var p in obj) {
          result.push(obj[p]);
        }
        this.stores.record.data = result;
        this.stores.record.query.totalCount = result.length; //res.data.totalCount;
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
    this.initCustom();
  },
};
</script>

<style lang='less' scope>
.iptSearch {
  .ivu-input-default {
    height: 34px;
  }
}
</style>