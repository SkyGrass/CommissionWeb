<template>
  <div>
    <Form
      :model="formModel.fields"
      inline
      ref="formRecord"
      @submit.native.prevent
      :rules="formModel.rules"
      :label-width="90"
    >
      <Row :gutter="16">
        <Col span="5">
          <FormItem label="单号" prop="fBillNo">
            <Input
              style="width: 165px"
              v-model="formModel.fields.fBillNo"
              readonly
            ></Input> </FormItem
        ></Col>
        <Col span="5">
          <FormItem label="日期" prop="fDate">
            <DatePicker
              type="date"
              style="width: 165px"
              placeholder="请选择日期"
              v-model="formModel.fields.fDate"
              :readonly="!canEdit"
              format="yyyy-MM-dd"
            ></DatePicker> </FormItem
        ></Col>

        <Col span="5">
          <FormItem label="业务员" prop="fSalesmanId"
            ><Select
              style="width: 165px"
              clearable
              v-model="formModel.fields.fSalesmanId"
              placeholder="请选择业务员"
              :disabled="formModel.fields.fSalesmanId > -1"
            >
              <Option
                v-for="item in salesmans"
                v-bind:key="item.id"
                :value="item.id"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem></Col
        >
      </Row>
      <Row :gutter="16">
        <Col span="13">
          <FormItem label="备注" prop="fRemark" style="width: 100%">
            <Input
              v-model="formModel.fields.fRemark"
              type="textarea"
              :readonly="!canEdit"
              :autosize="{ minRows: 1, maxRows: 1 }"
              placeholder="请在此输入备注..."
            ></Input>
          </FormItem>
        </Col>
        <Col span="4">
          <Button type="warning" @click="handleChoose" v-show="canEdit"
            >选择销售业务单</Button
          ><Button
            type="info"
            @click="handleSubmit"
            v-show="canEdit && list.length > 0"
            >保存</Button
          ><Button type="warning" @click="resetForm" v-show="!canEdit"
            >继续新增</Button
          >
        </Col>
      </Row>
    </Form>
    <Card>
      <!-- <ButtonGroup style="margin-bottom: 10px" v-show="canEdit">
        <Button type="primary" size="small" @click="newRow">新行</Button>
        <Button type="error" size="small" @click="deleteRow">删行</Button>
      </ButtonGroup> -->
      <Table
        ref="record"
        resizable
        border
        fit
        :max-height="maxHeight"
        :columns="columns"
        :data="list"
        @on-row-click="selectRow"
      >
      </Table
    ></Card>

    <Modal
      v-model="showModal"
      title="选择销售业务单"
      width="80%"
      :style="modalStyle"
      :mask-closable="false"
    >
      <div slot="footer">
        <Button type="warning" @click="showModal = false">取消</Button>
        <Button type="primary" @click="onConfirmChoose">确定</Button>
      </div>
      <div style="height: 600px">
        <Row>
          <Col style="margin-bottom: 10px">
            <DatePicker
              type="date"
              style="width: 145px"
              placeholder="请选择日期"
              v-model="stores.record.query.beginDate"
            ></DatePicker>
            <DatePicker
              type="date"
              style="width: 145px"
              placeholder="请选择日期"
              v-model="stores.record.query.endDate"
            ></DatePicker>
            <Select
              style="width: 162px"
              clearable
              v-model="stores.record.query.salesmanId"
              placeholder="请选择业务员"
            >
              <Option
                v-for="item in salesmans"
                v-bind:key="item.id"
                :value="item.id"
                >{{ item.text }}</Option
              >
            </Select>
            <Button
              style="margin-left: 5px"
              type="default"
              @click="initSalesman"
              :loading="reloading"
              >重载</Button
            >
            <Button
              type="info"
              style="margin-left: 10px"
              @click="loadRecordList"
              >查询</Button
            >
          </Col>
        </Row>
        <Card>
          <dz-table
            :totalCount="stores.record.query.totalCount"
            :pageSize="stores.record.query.pageSize"
            @on-page-change="handlePageChanged"
            @on-page-size-change="handlePageSizeChanged"
          >
            <Table
              slot="table"
              resizable
              border
              fit
              max-Height="550px"
              :columns="columns_bill"
              :data="stores.record.data"
              :row-class-name="rowClsRender"
              @on-selection-change="handleSelectionChange"
              @on-page-change="handlePageChanged"
              @on-page-size-change="handlePageSizeChanged"
              @on-sort-change="handleSortChange"
            >
              <template slot-scope="{ row, index }" slot="fIsCommission">
                <Tag :color="renderStatus(row.fIsCommission).color">{{
                  renderCommissionStatus(row.fIsCommission).text
                }}</Tag>
              </template>
            </Table></dz-table
          ></Card
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  genBillNo,
  createRecord,
  loadRecord,
  getCalcRecordList,
  getCalcRecordEntry,
} from "@/api/bus/calcRecord";
import { getRecordChooseList } from "@/api/bus/record";
import { getAllSalesman } from "@/api/base/saleman";
import { getBindUser } from "@/api/rbac/user";
import dayjs from "dayjs";
import NP from "number-precision";
import DzTable from "_c/tables/dz-table.vue";
export default {
  name: `calc_record_page`,
  components: {
    DzTable,
  },
  data() {
    var self = this;
    return {
      formModel: {
        mode: "create",
        selection: [],
        fields: {
          fId: -1,
          fBillNo: "",
          fDate: new Date(),
          fSalesmanId: -1,
          fRemark: "",
        },
        rules: {
          fBillNo: [
            {
              type: "string",
              required: true,
              message: "请输入单号",
              min: 3,
            },
          ],
          fDate: [
            {
              type: "date",
              required: true,
              message: "请选择日期",
              trigger: "change",
              pattern: /.+/,
            },
          ],

          fSalesmanId: [
            {
              required: true,
              message: "请选择业务员",
              trigger: "change",
              type: "number",
            },
          ],
        },
      },
      stores: {
        record: {
          data: [],
          query: {
            totalCount: 0,
            pageSize: 20,
            currentPage: 1,
            beginDate: dayjs(new Date()).add(-7, "day").format("YYYY-MM-DD"),
            endDate: dayjs(new Date()).format("YYYY-MM-DD"),
            salesmanId: -1,
            isCommission: 1,
            sort: [
              {
                direct: "DESC",
                field: "fBillNo",
              },
            ],
          },
        },
      },
      columns: [
        {
          width: 50,
          key: "fIndex",
          title: "序号",
          align: "center",
        },
        {
          width: 150,
          key: "fCustomName",
          title: "客户名称",
          align: "center",
        },
        {
          width: 150,
          key: "fSoftwareName",
          title: "软件产品",
          align: "center",
        },
        {
          width: 350,
          key: "fModule",
          title: "模块明细",
          align: "center",
        },
        {
          width: 150,
          key: "fContractPrice",
          title: "合同总金额",
          align: "right",
        },
        {
          width: 150,
          key: "fStandardPrice",
          title: "模块标准价",
          align: "right",
        },
        {
          width: 150,
          key: "fDcRate",
          title: "成交折扣",
          align: "center",
        },
        {
          width: 150,
          key: "fCommissionPrice",
          title: "提成金额",
          align: "center",
        },
        {
          width: 150,
          key: "fExpand",
          title: "加减项",
          align: "right",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h(
              "div",
              self.canEdit
                ? [
                    h(
                      "InputNumber",
                      {
                        props: {
                          step: 1,
                          value: this.list[index][key],
                        },
                        style: {
                          width: "80%",
                        },
                        on: {
                          "on-change": (e) => {
                            let fCommissionPrice = this.list[index][
                              "fCommissionPrice"
                            ];
                            fCommissionPrice = NP.plus(fCommissionPrice, e);
                            this.list[index][key] = e;
                            let t = this.list[index];
                            t.fTotal = fCommissionPrice;
                            this.$set(this.list, index, t);
                          },
                        },
                      },
                      " "
                    ),
                  ]
                : [h("div", this.list[index][key])]
            );
          },
        },
        {
          width: 150,
          key: "fTotal",
          title: "提成合计",
          align: "right",
        },
      ],
      columns_bill: [
        { type: "selection", width: 50, key: "handle" },
        {
          width: 150,
          key: "fBillNo",
          title: "单号",
          align: "center",
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
            return h("div", [h("div", dayjs(time).format("YYYY-MM-DD HH:mm"))]);
          },
        },
        {
          width: 150,
          key: "fCustomName",
          title: "客户名称",
          align: "center",
        },
        {
          width: 120,
          key: "fSalesmanName",
          title: "业务员",
          align: "center",
        },
        {
          width: 120,
          key: "fConfirmerName",
          title: "经办人",
          align: "center",
        },
        {
          title: "是否计提",
          key: "fIsCommission",
          align: "center",
          width: 120,
          slot: "fIsCommission",
        },
        {
          width: 250,
          key: "fRemark",
          title: "备注",
          align: "center",
        },
      ],
      form: {
        fSoftwareId: -1,
        fModule: "",
        fContractPrice: 0,
        fStandardPrice: 0,
        fDcRate: 0,
        fPoints: 0,
      },
      list: [],
      salesmans: [],
      curSelectRowIndex: -1,
      curSelectRow: {},
      canEdit: false,
      showModal: false,
      modalStyle: { height: "300px" },
      reloading: false,
    };
  },
  computed: {
    maxHeight() {
      return document.body.offsetHeight - 350;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.id);
    },
  },
  methods: {
    loadRecordInfo(id) {
      loadRecord({ id: id }).then((res) => {
        if (res.data.data.length > 0) {
          this.formModel.fields.fId = res.data.data[0]["fId"];
          this.formModel.fields.fBillNo = res.data.data[0]["fBillNo"];
          this.formModel.fields.fDate = res.data.data[0]["fDate"];
          this.formModel.fields.fSalesmanId = res.data.data[0]["fSalesmanId"];
          this.formModel.fields.fRemark = res.data.data[0]["fRemark"];

          this.list = res.data.data.map((f, index) => {
            let m = f;
            m.fIndex = index + 1;
            m.fRecordId = f.fRecordId;
            m.fRecordEntryId = f.fRecordEntryId;
            return m;
          });
        }
      });
    },
    initBillNo() {
      genBillNo({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.formModel.fields.fBillNo = data;
        }
      });
    },
    initSalesman() {
      this.reloading = true;
      this.stores.record.query.salesmanId = -1;
      getAllSalesman({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.salesmans = data;
          this.reloading = false;
        }
      });
    },
    initUserBind(guid) {
      getBindUser({ guid }).then(({ data: { state, data } }) => {
        if (data) {
          const { salesmanId } = data;
          this.formModel.fields.fSalesmanId = salesmanId;
        }
      });
    },
    selectRow(row, index) {
      this.curSelectRowIndex = index;
      this.curSelectRow = row;
    },
    newRow() {
      this.list = this.list.concat(Object.assign({}, this.form));
    },
    deleteRow() {
      if (this.curSelectRowIndex > -1) {
        this.list.splice(this.curSelectRowIndex, 1);
      } else {
        this.list.splice(this.list.length - 1, 1);
      }
    },
    validateUserForm() {
      let _valid = false;
      this.$refs["formRecord"].validate((valid) => {
        if (!valid) {
          this.$Message.error("请完善表单信息");
        } else {
          _valid = true;
        }
      });
      return _valid;
    },
    handleSubmit() {
      let valid = this.validateUserForm();
      if (valid) {
        this.$Modal.confirm({
          title: "操作提示",
          content: "<p>确定要保存当前单据吗?</p>",
          loading: true,
          onOk: () => {
            if (this.beforeSave()) {
              if (this.formModel.mode === "create") {
                this.doCreateRecord();
              }
              if (this.formModel.mode === "edit") {
                this.doEditRecord();
              }
            }
          },
        });
      }
    },
    handleChoose() {
      this.showModal = true;
    },
    doCreateRecord() {
      createRecord(
        Object.assign(
          {},
          {
            form: Object.assign({}, this.formModel.fields, {
              fDate: dayjs(this.formModel.fields.fDate).format("YYYY-MM-DD"),
            }),
          },
          {
            Entry: this.list,
          }
        )
      ).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadRecordInfo(res.data.data.split("|").pop());
          this.canEdit = false;
        } else {
          this.$Message.warning(res.data.message);
        }

        this.$Modal.remove();
      });
    },
    doEditRecord() {
      createRecord(
        Object.assign(
          {},
          {
            form: Object.assign({}, this.formModel.fields, {
              fDate: dayjs(this.formModel.fields.fDate).format("YYYY-MM-DD"),
            }),
          },
          { Entry: this.list }
        )
      ).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadRecordInfo(res.data.data.split("|").pop());
          this.canEdit = false;
        } else {
          this.$Message.warning(res.data.message);
        }

        this.$Modal.remove();
      });
    },
    beforeSave() {
      if (this.list.length <= 0 || this.list.some((f) => f.fSoftwareId == -1)) {
        this.$Message.error("表体信息不完整!");
        return false;
      }
      let tmp = [...this.list].map((f) => {
        return f.fSoftwareId;
      });
      let len = tmp.length;
      tmp = new Set(tmp);
      if (len != tmp.size) {
        this.$Message.error("表体出现重复行!!");
        this.$Modal.remove();
        return false;
      }

      return true;
    },
    loadRecordList() {
      if (
        this.stores.record.query.beginDate == "" ||
        this.stores.record.query.endDate == ""
      ) {
        return this.$Message.warning("请选择要查询的日期区间");
      }
      if (
        this.stores.record.query.salesmanId == void 0 ||
        this.stores.record.query.salesmanId < 0
      ) {
        return this.$Message.warning("请选择要查询的业务员");
      }
      getRecordChooseList(
        Object.assign({}, this.stores.record.query, {
          beginDate: dayjs(this.stores.record.query.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: dayjs(this.stores.record.query.endDate).format("YYYY-MM-DD"),
          status: 1,
        })
      ).then((res) => {
        if (res.data.totalCount > 0) {
          this.stores.record.data = res.data.data;
          this.stores.record.query.totalCount = res.data.totalCount;
        } else {
          this.stores.record.data = [];
          this.$Message.warning("没有查询到数据，请尝试修改检索条件!");
        }
      });
    },
    handlePageChanged(page) {
      this.stores.record.query.currentPage = page;
      this.loadRecordList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.record.query.pageSize = pageSize;
      this.loadRecordList();
    },
    handleSortChange(column) {
      this.stores.record.query.sort.direction = column.order;
      this.stores.record.query.sort.field = column.key;
      this.loadPostList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    onConfirmChoose() {
      if (this.formModel.selection.length > 0) {
        this.$Modal.confirm({
          title: "操作提示",
          content: "<p>确定要选择这些记录吗?</p>",
          loading: true,
          onOk: () => {
            this.formModel.fields.fSalesmanId = this.stores.record.query.salesmanId;
            this.showModal = false;
            let ids = this.formModel.selection
              .map((m) => {
                return m.fId;
              })
              .join(",");
            getCalcRecordEntry(ids).then((res) => {
              this.list = res.data.data.map((m, index) => {
                m.fIndex = index + 1;
                m.fCommissionPrice = NP.times(m.fDcRate, m.fContractPrice);
                m.fExpand = 0;
                m.fTotal = NP.plus(NP.times(m.fDcRate, m.fContractPrice), 0);
                m.fRecordId = m.fId;
                m.fRecordEntryId = m.fEntryId;
                return m;
              });
              this.$Modal.remove();
            });
          },
        });
      } else {
        return this.$Message.warning("请选择至少一条数据");
      }
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
        case 0:
          _status.text = "不计提";
          break;
      }
      return _status;
    },
    resetForm() {
      this.canEdit = true;
      this.initBillNo();
      this.initSalesman();
      this.list = [];
      this.formModel.fields.fId = -1;
      this.formModel.fields.fSalesmanId = -1;
      this.formModel.fields.fRemark = "";
      this.initUserBind(this.$store.state.user.userGuid);
    },
  },
  mounted() {
    const { state } = this.$route.query;
    this.canEdit = state == "edit" || state == "create" || state == void 0;
    if (this.$route.query.id && this.$route.query.id > -1) {
      this.loadRecordInfo(this.$route.query.id);
    } else {
      this.initBillNo();
    }
    this.initSalesman();
    this.initUserBind(this.$store.state.user.userGuid);
  },
};
</script>
<style scoped>
.txtIpt {
  width: 200px;
}
</style>