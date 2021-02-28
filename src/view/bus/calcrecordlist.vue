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
                      placeholder="输入关键字搜索..."
                      @on-search="handleSearchRecord()"
                    >
                      <!-- <Select
                        slot="prepend"
                        v-model="stores.record.query.isDeleted"
                        @on-change="handleSearchRecord"
                        placeholder="删除状态"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.record.sources.isDeletedSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select> -->
                      <!-- <Select
                        slot="prepend"
                        v-model="stores.record.query.status"
                        @on-change="handleSearchRecord"
                        placeholder="单据状态"
                        style="width: 80px"
                      >
                        <Option
                          v-for="item in stores.record.sources.statusSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select> -->
                      <!-- <Select
                        slot="prepend"
                        v-model="stores.record.query.isCommission"
                        @on-change="handleSearchRecord"
                        placeholder="计提状态"
                        style="width: 80px"
                      >
                        <Option
                          v-for="item in stores.record.sources
                            .commissionSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select> -->
                      <!-- <Select
                        slot="prepend"
                        v-model="stores.record.query.customId"
                        placeholder="选择客户"
                        @on-change="handleSearchRecord"
                        style="width: 150px"
                      >
                        <Option
                          v-for="(option, index) in customs"
                          :value="option.id"
                          :key="index"
                          >{{ option.text }}</Option
                        >
                      </Select> -->
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
                        >
                      </Select>
                      <DatePicker
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
                <ButtonGroup style="display: none" class="mr3">
                  <Button
                    class="txt-danger"
                    icon="md-trash"
                    title="删除"
                    @click="handleBatchCommand('delete')"
                  ></Button>
                  <Button
                    class="txt-success"
                    icon="md-redo"
                    title="恢复"
                    @click="handleBatchCommand('recover')"
                  ></Button>
                  <Button
                    class="txt-danger"
                    icon="md-hand"
                    title="禁用"
                    @click="handleBatchCommand('forbidden')"
                  ></Button>
                  <Button
                    class="txt-success"
                    icon="md-checkmark"
                    title="启用"
                    @click="handleBatchCommand('normal')"
                  ></Button>
                  <Button
                    icon="md-refresh"
                    title="刷新"
                    @click="handleRefresh"
                  ></Button>
                </ButtonGroup>

                <Button
                  v-can="'create'"
                  icon="md-download"
                  type="info"
                  @click="handleExport"
                  title="导出"
                  style="margin-right: 10px"
                  >导出</Button
                >
                <Button
                  v-can="'create'"
                  icon="md-create"
                  type="primary"
                  @click="handleShowCreateWindow"
                  title="新增计算单"
                  >新增计算单</Button
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
          <template slot-scope="{ row, index }" slot="fStatus">
            <Tag :color="renderStatus(row.fStatus).color">{{
              renderStatus(row.fStatus).text
            }}</Tag>
          </template>
          <!-- <template slot-scope="{ row, index }" slot="fIsCommission">
            <Tag :color="renderStatus(row.fIsCommission).color">{{
              renderCommissionStatus(row.fIsCommission).text
            }}</Tag>
          </template> -->

          <template slot-scope="{ row, index }" slot="fIsDeleted">
            <Tag :color="renderBillStatus(row.fIsDeleted).color">{{
              renderBillStatus(row.fIsDeleted).text
            }}</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Poptip
              confirm
              :transfer="true"
              title="确定要删除吗?"
              v-show="!row.fIsDeleted && row.fStatus == 0"
              @on-ok="handleDelete(row)"
            >
              <Tooltip
                placement="top"
                content="删除"
                :delay="1000"
                :transfer="true"
              >
                <Button
                  type="error"
                  size="small"
                  shape="circle"
                  icon="md-trash"
                ></Button>
              </Tooltip>
            </Poptip>
            <Tooltip
              placement="top"
              content="编辑"
              :delay="1000"
              v-show="!row.fIsDeleted && row.fStatus == 0"
              :transfer="true"
            >
              <Button
                v-can="'edit'"
                type="primary"
                size="small"
                shape="circle"
                icon="md-create"
                @click="handleEdit(row)"
              ></Button>
            </Tooltip>
            <!-- <Poptip
              confirm
              :transfer="true"
              title="确定要审批吗?"
              v-show="row.fStatus == 0"
              @on-ok="handleAudit(row)"
            >
              <Tooltip
                placement="top"
                content="审批"
                :delay="1000"
                :transfer="true"
              >
                <Button
                  type="error"
                  size="small"
                  shape="circle"
                  icon="md-bookmarks"
                ></Button>
              </Tooltip>
            </Poptip> -->
            <Tooltip
              placement="top"
              content="查看"
              :delay="1000"
              :transfer="true"
            >
              <Button
                v-can="'read'"
                type="primary"
                size="small"
                shape="circle"
                icon="md-search"
                @click="handleRead(row)"
              ></Button>
            </Tooltip>
          </template>
        </Table>
      </dz-table>
    </Card>
  </div>
</template>

<script>
import DzTable from "_c/tables/dz-table.vue";
import {
  getCalcRecordList,
  deleteCalcRecord,
  auditCalcRecord,
  exportData,
} from "@/api/bus/calcRecord";
import dayjs from "dayjs";
import { getAllSalesman } from "@/api/base/saleman";
import { b64toFile } from "@/libs/tools";
import { saveAs } from "file-saver";
export default {
  name: "calc_record_list_page",
  components: {
    DzTable,
  },
  data() {
    return {
      commands: {
        delete: { name: "delete", title: "删除" },
        recover: { name: "recover", title: "恢复" },
        forbidden: { name: "forbidden", title: "禁用" },
        normal: { name: "normal", title: "启用" },
      },
      formModel: {
        opened: false,
        title: "创建客户",
        mode: "create",
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
            beginDate: dayjs(new Date()).add(-7, "day").format("YYYY-MM-DD"),
            endDate: dayjs(new Date()).format("YYYY-MM-DD"),
            sort: [
              {
                direct: "DESC",
                field: "fBillNo",
              },
            ],
          },
          sources: {
            isDeletedSources: [
              { value: -1, text: "全部" },
              { value: 0, text: "正常" },
              { value: 1, text: "已删" },
            ],
            statusSources: [
              { value: -1, text: "全部" },
              { value: 0, text: "未审批" },
              { value: 1, text: "已审批" },
            ],
            commissionSources: [
              { value: -1, text: "全部" },
              { value: 0, text: "不计提" },
              { value: 1, text: "计提" },
            ],
          },
          columns: [
            { type: "selection", width: 50, key: "handle" },
            {
              title: "单号",
              key: "fBillNo",
              align: "center",
              width: 150,
              sortable: true,
            },
            {
              title: "日期",
              key: "fDate",
              width: 150,
              align: "center",
              render: (h, params) => {
                const {
                  row,
                  column: { key },
                  index,
                } = params;
                let time = new Date(this.stores.record.data[index][key]);
                return h("div", [
                  h("div", dayjs(time).format("YYYY-MM-DD HH:mm")),
                ]);
              },
            },
            {
              title: "业务员",
              key: "fSalesmanId",
              align: "center",
              width: 120,
              render: (h, { row: { fSalesmanId } }) => {
                const row = this.salesmans.filter(
                  (f) => f.id == fSalesmanId
                )[0];
                return h("div", row && row.name);
              },
            },
            {
              title: "模块明细",
              key: "fModule",
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
              title: "合同总金额",
              key: "fContractPrice",
              align: "right",
              width: 120,
            },
            {
              title: "模块标准价",
              key: "fStandardPrice",
              align: "right",
              width: 120,
            },
            {
              title: "成交折扣",
              key: "fDcRate",
              align: "center",
              width: 100,
            },
            {
              title: "提成金额",
              key: "fCommissionPrice",
              align: "right",
              width: 120,
            },
            {
              title: "加减项目",
              key: "fExpand",
              align: "right",
              width: 120,
            },
            {
              title: "提成合计",
              key: "fTotal",
              align: "right",
              width: 120,
            },
            {
              title: "本单积分",
              key: "fPoints",
              align: "center",
              width: 120,
            },
            { title: "备注", key: "fRemark", width: 150 },
            // {
            //   title: "是否计提",
            //   key: "fIsCommission",
            //   align: "center",
            //   width: 120,
            //   slot: "fIsCommission",
            // },
            // {
            //   title: "审批状态",
            //   key: "fStatus",
            //   align: "center",
            //   width: 120,
            //   slot: "fStatus",
            // },
            {
              title: "单据状态",
              key: "fIsDeleted",
              align: "center",
              width: 120,
              slot: "fIsDeleted",
            },
            {
              title: "操作",
              align: "center",
              width: 150,
              className: "table-command-column",
              slot: "action",
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
      iptIndex: 1,
      typesIcons: ["ios-eye-outline", "ios-eye-off-outline"],
      types: ["password", "text"],
      salesmans: [],
      loadingSearchSalesman: false,
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
      getCalcRecordList(
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
    handleAudit(row) {
      let id = row.fId;
      if (!id) {
        this.$Message.warning("请选择至少一条数据");
        return;
      }
      auditCalcRecord(id).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadRecordList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    handleEdit(row) {
      const route = {
        name: "calc_record_page",
        query: {
          id: row.fId,
          state: "edit",
        },
        meta: {
          title: "提成计算单录入-修改",
        },
      };
      this.$router.push(route);
    },
    handleRead(row) {
      const route = {
        name: "calc_record_page",
        query: {
          id: row.fId,
          state: "read",
        },
        meta: {
          title: "提成计算单录入-查看",
        },
      };
      this.$router.push(route);
    },
    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadRecordList();
    },
    handleDelete(row) {
      this.doDelete(row.fId);
    },
    doDelete(ids) {
      if (!ids) {
        this.$Message.warning("请选择至少一条数据");
        return;
      }
      deleteCalcRecord(ids).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadRecordList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
      });
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
    renderStatus(status) {
      let _status = {
        color: "success",
        text: "已审批",
      };
      switch (status) {
        case 0:
          _status.text = "未审批";
          _status.color = "error";
          break;
      }
      return _status;
    },
    renderBillStatus(status) {
      let _status = {
        color: "success",
        text: "正常",
      };
      switch (status) {
        case true:
          _status.text = "已删除";
          _status.color = "error";
          break;
      }
      return _status;
    },
    handleShowCreateWindow() {
      const route = {
        name: "calc_record_page",
        query: {
          id: -1,
          state: "create",
        },
        meta: {
          title: "提成计算单录入-新增",
        },
      };
      this.$router.push(route);
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
