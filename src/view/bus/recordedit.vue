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
              style="width: 185px"
              type="date"
              placeholder="请选择日期"
              v-model="formModel.fields.fDate"
              :readonly="!canEdit"
              format="yyyy-MM-dd"
            ></DatePicker> </FormItem
        ></Col>
        <Col span="6">
          <FormItem label="客户" prop="fCustomId"
            ><Select
              style="width: 205px"
              clearable
              filterable
              v-model="formModel.fields.fCustomId"
              :disabled="!canEdit"
              placeholder="请选择客户"
            >
              <Option
                v-for="item in customs"
                v-bind:key="item.id"
                :value="item.id"
                >{{ item.text }}</Option
              >
            </Select>
            <Button
              style="margin-left: 5px"
              type="default"
              @click="initCustom"
              :loading="reloading"
              >重载</Button
            >
          </FormItem></Col
        >
      </Row>
      <Row :gutter="16">
        <Col span="5">
          <FormItem label="业务员" prop="fSalesmanId"
            ><Select
              style="width: 165px"
              clearable
              v-model="formModel.fields.fSalesmanId"
              placeholder="请选择业务员"
              :disabled="haveBind || !canEdit"
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
        <Col span="5">
          <FormItem label="经办人" prop="fConfirmerId"
            ><Select
              style="width: 185px"
              clearable
              v-model="formModel.fields.fConfirmerId"
              placeholder="请选择经办人"
              :disabled="!canEdit"
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
        <Col span="5">
          <FormItem label="计提" prop="fisCommissionV">
            <Select
              style="width: 205px"
              v-model="formModel.fields.fisCommissionV"
              placeholder="请选择是否计提"
              :disabled="!canEdit"
            >
              <Option value="1">计提</Option>
              <Option value="0">不计提</Option>
            </Select>
          </FormItem></Col
        >
      </Row>
      <Row :gutter="12">
        <Col span="15">
          <FormItem label="备注" prop="fRemark" style="width: 100%">
            <Input
              style="width: 100%"
              v-model="formModel.fields.fRemark"
              type="textarea"
              :readonly="!canEdit"
              :autosize="{ minRows: 1, maxRows: 1 }"
              placeholder="请在此输入备注..."
            ></Input>
          </FormItem>
        </Col>
        <Col span="2"
          ><Button type="info" @click="handleSubmit" v-show="canEdit"
            >保存</Button
          ></Col
        >
      </Row>
    </Form>
    <Card>
      <ButtonGroup style="margin-bottom: 10px" v-show="canEdit">
        <Button type="primary" size="small" @click="newRow">新行</Button>
        <Button type="error" size="small" @click="deleteRow">删行</Button>
      </ButtonGroup>
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
  </div>
</template>
<script>
import { getSoftWareSelectList } from "@/api/base/software";
import { genBillNo, loadRecord, loadRecordEntry } from "@/api/bus/record";
import { getAllCustom } from "@/api/base/custom";
import { getAllSalesman } from "@/api/base/saleman";
import { getBindUser } from "@/api/rbac/user";
import { createRecord } from "@/api/bus/record";
import dayjs from "dayjs";
import NP from "number-precision";
export default {
  name: `record_edit_page`,
  data() {
    var self = this;
    return {
      formModel: {
        mode: "create",
        fields: {
          fId: -1,
          fBillNo: "",
          fDate: new Date(),
          fCustomId: -1,
          fSalesmanId: -1,
          fisCommissionV: "1",
          fRemark: "",
          fisAudit: 0,
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
          fCustomId: [
            {
              required: true,
              message: "请选择客户",
              trigger: "change",
              type: "number",
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
          fConfirmerId: [
            {
              required: true,
              message: "请选择经办人",
              trigger: "change",
              type: "number",
            },
          ],
        },
      },
      softwares: [],
      columns: [
        {
          width: 250,
          key: "fSoftwareId",
          title: "软件系列",
          align: "center",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            const val = row[key];
            const software = this.softwares.filter((f) => f.id == val);
            return h(
              "div",
              self.canEdit
                ? [
                    h(
                      "Select",
                      {
                        props: {
                          transfer: true,
                          value: row[key],
                        },
                        on: {
                          "on-change": (e) => {
                            this.list[index][key] = e;
                          },
                        },
                      },
                      this.softwares.map((item) => {
                        return h("Option", {
                          props: {
                            value: item.value,
                            label: item.text,
                          },
                        });
                      })
                    ),
                  ]
                : [
                    h(
                      "div",
                      software && software.length > 0 ? software[0]["name"] : ""
                    ),
                  ]
            );
          },
        },
        {
          width: 450,
          key: "fModule",
          title: "模块明细",
          align: "center",
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
                      "Input",
                      {
                        props: {
                          step: 1,
                          value: this.list[index][key],
                          disabled: !self.canEdit,
                          type: "textarea",
                        },
                        style: {
                          width: "100%",
                        },
                        on: {
                          input: (val) => {
                            this.list[index][key] = val;
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
          key: "fContractPrice",
          title: "合同总金额",
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
                          min: 0,
                          value: this.list[index][key],
                          disabled: !self.canEdit,
                        },
                        style: {
                          width: "80%",
                        },
                        on: {
                          "on-change": (e) => {
                            const standardPrice = this.list[index][
                              "fStandardPrice"
                            ];
                            const result = NP.divide(e, standardPrice);

                            this.list[index]["fDcRate"] = Number(
                              (result == Infinity ? 0 : result).toFixed(2)
                            );
                            this.list[index]["fPoints"] = Number(e);
                            this.list[index][key] = Number(e);
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
          key: "fStandardPrice",
          title: "模块标准价",
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
                          min: 0,
                          value: this.list[index][key],
                          disabled: !self.canEdit,
                        },
                        style: {
                          width: "80%",
                        },
                        on: {
                          "on-change": (e) => {
                            const contractPrice = this.list[index][
                              "fContractPrice"
                            ];
                            this.list[index]["fDcRate"] = Number(
                              NP.divide(contractPrice, e).toFixed(2)
                            );
                            this.list[index][key] = Number(e);
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
          key: "fDcRate",
          title: "成交折扣",
          align: "center",
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
                          step: 0.01,
                          min: 0,
                          value: this.list[index][key],
                          disabled: true,
                        },
                        style: {
                          width: "80%",
                        },
                        on: {
                          "on-change": (e) => {
                            this.list[index][key] = e;
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
          key: "fPoints",
          title: "本单积分",
          align: "center",
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
                            this.list[index][key] = e;
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
      customs: [],
      salesmans: [],
      curSelectRowIndex: -1,
      curSelectRow: {},
      canEdit: false,
      reloading: false,
      haveBind: false,
    };
  },
  computed: {
    maxHeight() {
      return document.body.offsetHeight - 350;
    },
  },
  methods: {
    loadSoftWareList() {
      getSoftWareSelectList({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.softwares = data;
        }
      });
    },
    loadRecordInfo(id) {
      loadRecord({ id: id }).then((res) => {
        res.data.data.fisCommissionV = res.data.data.fIsCommission ? "1" : "0";
        this.formModel.fields = res.data.data;
      });
      loadRecordEntry({ id: id }).then((res) => {
        this.list = res.data.data;
      });
    },
    initBillNo() {
      genBillNo({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.formModel.fields.fBillNo = data;
        }
      });
    },
    initCustom() {
      this.reloading = true;
      this.formModel.fields.fCustomId = -1;
      getAllCustom({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.customs = data;
          this.reloading = false;
        }
      });
    },
    initSalesman() {
      getAllSalesman({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.salesmans = data;
        }
      });
    },
    initUserBind(guid) {
      getBindUser({ guid }).then(({ data: { state, data } }) => {
        if (data) {
          const { salesmanId } = data;
          this.formModel.fields.fSalesmanId = salesmanId;
          this.haveBind = salesmanId > -1;
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
    doCreateRecord() {
      createRecord(
        Object.assign(
          {},
          {
            form: Object.assign({}, this.formModel.fields, {
              fisCommission:
                this.formModel.fields.fisCommissionV == "1" ? 1 : 0,
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
    doEditRecord() {
      createRecord(
        Object.assign(
          {},
          {
            form: Object.assign({}, this.formModel.fields, {
              fisCommission:
                this.formModel.fields.fisCommissionV == "1" ? 1 : 0,
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
  },
  mounted() {
    const { state } = this.$route.query;
    this.canEdit = state == "edit" || state == "create" || state == void 0;

    this.loadSoftWareList();
    if (this.$route.query.id && this.$route.query.id > -1) {
      this.loadRecordInfo(this.$route.query.id);
    } else {
      this.initBillNo();
    }
    this.initCustom();
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