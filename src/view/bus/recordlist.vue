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
                      class="iptSearch"
                      search
                      v-model="stores.record.query.kw"
                      enter-button="搜索"
                      placeholder="输入关键字搜索..."
                      @on-search="handleSearchRecord"
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.record.query.status"
                        placeholder="客户状态"
                        style="width: 80px"
                      >
                        <OptionGroup label="客户状态">
                          <Option
                            v-for="item in stores.record.sources.statusSources"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.text }}</Option
                          >
                        </OptionGroup>
                      </Select>
                      <Select
                        slot="prepend"
                        v-model="stores.record.query.isCommission"
                        placeholder="计提状态"
                        style="width: 80px"
                      >
                        <OptionGroup label="计提状态">
                          <Option
                            v-for="item in stores.record.sources
                              .commissionSources"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.text }}</Option
                          >
                        </OptionGroup>
                      </Select>

                      <!-- <Select
                        slot="prepend"
                        v-model="stores.record.query.customId"
                        placeholder="输入关键字选择客户"
                        filterable
                        clearable
                        style="width: 160px"
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
                        style="width: 150px"
                      >
                        <OptionGroup label="业务员">
                          <Option
                            v-for="(option, index) in salesmans"
                            :value="option.id"
                            :key="index"
                            >{{ option.text }}</Option
                          >
                        </OptionGroup>
                      </Select>
                      <Select
                        slot="prepend"
                        placeholder="选择经办人"
                        v-model="stores.record.query.confirmerId"
                        style="width: 150px"
                      >
                        <OptionGroup label="经办人">
                          <Option
                            v-for="(option, index) in salesmans"
                            :value="option.id"
                            :key="index"
                            >{{ option.text }}</Option
                          >
                        </OptionGroup>
                      </Select>
                      <DatePicker
                        slot="prepend"
                        type="date"
                        style="width: 145px"
                        placeholder="请选择日期"
                        size="small"
                        v-model="stores.record.query.beginDate"
                      ></DatePicker>
                      <DatePicker
                        slot="prepend"
                        type="date"
                        style="width: 145px"
                        placeholder="请选择日期"
                        size="small"
                        v-model="stores.record.query.endDate"
                      ></DatePicker>
                    </Input>
                  </FormItem>
                </Form>
              </Col>
              <Col span="3">
                <h4>
                  合同金额合计：<strong>{{ total }}</strong
                  >￥
                </h4></Col
              >
              <Col span="8" class="dnc-toolbar-btns">
                <Button
                  v-can="'export'"
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
                  title="新增销售记录"
                  >新增销售记录</Button
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
          <template slot-scope="{ row, index }" slot="fIsCommission">
            <Tag :color="renderStatus(row.fIsCommission).color">{{
              renderCommissionStatus(row.fIsCommission).text
            }}</Tag>
          </template>

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
                  v-can="'delete'"
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
            <Poptip
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
                  v-can="'audit'"
                  type="error"
                  size="small"
                  shape="circle"
                  icon="md-share-alt"
                ></Button>
              </Tooltip>
            </Poptip>
            <Poptip
              confirm
              :transfer="true"
              title="确定要反审批吗?"
              v-show="row.fStatus == 1"
              @on-ok="handleUnAudit(row)"
            >
              <Tooltip
                placement="top"
                content="反审批"
                :delay="1000"
                :transfer="true"
              >
                <Button
                  v-can="'unaudit'"
                  type="error"
                  size="small"
                  shape="circle"
                  icon="md-undo"
                ></Button>
              </Tooltip>
            </Poptip>
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
  getRecordList,
  deleteRecord,
  auditRecord,
  unAuditRecord,
  exportData,
} from "@/api/bus/record";
import dayjs from "dayjs";
import { getAllCustom } from "@/api/base/custom";
import { getAllSalesman } from "@/api/base/saleman";
import { b64toFile } from "@/libs/tools";
import { saveAs } from "file-saver";
import NP from "number-precision";
export default {
  name: "record_list_page",
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
        fields: {
          id: -1,
          code: "",
          name: "",
          linkName: "",
          linkPhone: "",
          cardNo: "",
          description: "",
          status: 1,
          isDeleted: 0,
          createdOn: null,
          createdByUserGuid: "",
          createdByUserName: "",
          modifiedOn: null,
          modifiedByUserGuid: "",
          modifiedByUserName: "",
        },
        rules: {
          code: [
            {
              type: "string",
              required: true,
              message: "请输入客户编码",
              min: 1,
            },
          ],
          name: [
            {
              type: "string",
              required: true,
              message: "请输入客户名称",
              min: 1,
            },
          ],
          linkName: [
            {
              type: "string",
              required: true,
              message: "请输入客户联系人",
              min: 1,
            },
          ],
          linkPhone: [
            {
              type: "string",
              required: true,
              message: "请输入客户联系人电话",
              min: 11,
            },
          ],
        },
      },
      stores: {
        record: {
          query: {
            totalCount: 0,
            pageSize: 20,
            currentPage: 1,
            kw: "",
            isDeleted: 0,
            isCommission: -1,
            status: -1,
            salesmanId: -1,
            customId: -1,
            confirmerId: -1,
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
              title: "客户",
              key: "fCustomId",
              align: "center",
              width: 100,
              render: (h, { row: { fCustomId } }) => {
                const row = this.customs.filter((f) => f.id == fCustomId)[0];
                return h("div", row && row.name);
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
              title: "经办人",
              key: "fConfirmerId",
              align: "center",
              width: 120,
              render: (h, { row: { fConfirmerId } }) => {
                const row = this.salesmans.filter(
                  (f) => f.id == fConfirmerId
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
              title: "本单积分",
              key: "fPoints",
              align: "center",
              width: 120,
            },
            { title: "备注", key: "fRemark", width: 150 },
            {
              title: "是否计提",
              key: "fIsCommission",
              align: "center",
              width: 120,
              slot: "fIsCommission",
            },
            {
              title: "审批状态",
              key: "fStatus",
              align: "center",
              width: 120,
              slot: "fStatus",
            },
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
      salesmans_copy: [],
      customs: [],
      loadingSearchSalesman: false,
      defaultData: [{ id: -1, name: "全部", value: -1, text: "全部" }],
      total: 0,
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
    initSalesman() {
      getAllSalesman({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.salesmans = this.defaultData.concat(data);
        }
      });
    },

    loadRecordList() {
      getRecordList(
        Object.assign({}, this.stores.record.query, {
          beginDate: dayjs(this.stores.record.query.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: dayjs(this.stores.record.query.endDate).format("YYYY-MM-DD"),
        })
      ).then((res) => {
        this.stores.record.data = res.data.data;
        let sum = 0;
        if (Array.isArray(res.data.data)) {
          res.data.data.forEach((row) => {
            sum = NP.plus(sum, row.fContractPrice);
          });
        }
        this.total = sum.toFixed(2);
        this.stores.record.query.totalCount = res.data.totalCount;
      });
    },
    handleAudit(row) {
      let id = row.fId;
      if (!id) {
        this.$Message.warning("请选择至少一条数据");
        return;
      }
      auditRecord(id).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadRecordList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    handleUnAudit(row) {
      let id = row.fId;
      if (!id) {
        this.$Message.warning("请选择至少一条数据");
        return;
      }
      unAuditRecord(id).then((res) => {
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
        name: "record_edit_page",
        query: {
          id: row.fId,
          state: "edit",
        },
        meta: {
          title: "销售记录录入-修改",
        },
      };
      this.$router.push(route);
    },
    handleRead(row) {
      const route = {
        name: "record_page",
        query: {
          id: row.fId,
          state: "read",
        },
        meta: {
          title: "销售记录录入-查看",
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
      deleteRecord(ids).then((res) => {
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
    renderCommissionStatus(status) {
      let _status = {
        text: "计提",
      };
      switch (status) {
        case false:
          _status.text = "不计提";
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
        name: "record_page",
        query: {
          id: -1,
          state: "create",
        },
        meta: {
          title: "销售记录录入-新增",
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
    this.initCustom();
    this.initSalesman();
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
