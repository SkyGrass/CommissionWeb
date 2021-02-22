<template>
  <div>
    <Form
      :model="formModel.fields"
      inline
      ref="formRecord"
      @submit.native.prevent
      :label-width="90"
    >
      <Row :gutter="16">
        <Col span="3">
          <FormItem label="单号" prop="fBillNo">
            <Input
              style="width: 165px"
              v-model="formModel.fields.fBillNo"
              readonly
            ></Input> </FormItem
        ></Col>
        <Col span="3">
          <FormItem label="日期" prop="fDate" style="width: 165px">
            <DatePicker
              type="date"
              style="width: 165px"
              placeholder="请选择日期"
              v-model="formModel.fields.fDate"
            ></DatePicker> </FormItem
        ></Col>
        <Col span="3">
          <FormItem label="客户" prop="fCustomId"
            ><Select
              style="width: 162px"
              clearable
              v-model="formModel.fields.fCustomId"
              placeholder="请选择客户"
            >
              <Option
                v-for="item in customs"
                v-bind:key="item.id"
                :value="item.id"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem></Col
        >
      </Row>
      <Row :gutter="16">
        <Col span="3">
          <FormItem label="业务员" prop="fSalesmanId"
            ><Select
              style="width: 162px"
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
        <Col span="3">
          <FormItem label="经办人" prop="fConfirmerId"
            ><Select
              style="width: 162px"
              clearable
              v-model="formModel.fields.fConfirmerId"
              placeholder="请选择经办人"
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
        <Col span="3">
          <FormItem label="计提" prop="fisCommisionV">
            <Select
              style="width: 162px"
              v-model="formModel.fields.fisCommisionV"
              placeholder="请选择是否计提"
            >
              <Option value="1">计提</Option>
              <Option value="0">不计提</Option>
            </Select>
          </FormItem></Col
        >
      </Row>
      <Row :gutter="16">
        <Col span="10">
          <FormItem label="备注" prop="fRemark" style="width: 100%">
            <Input
              v-model="formModel.fields.fRemark"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 1 }"
              placeholder="请在此输入备注..."
            ></Input>
          </FormItem>
        </Col>
        <Col span="2"
          ><Button type="info" @click="handleSubmit">保存</Button></Col
        >
      </Row>
    </Form>
    <Card>
      <ButtonGroup style="margin-bottom: 10px">
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
import { genBillNo } from "@/api/bus/record";
import { getAllCustom } from "@/api/base/custom";
import { getAllSalesman } from "@/api/base/saleman";
import { getBindUser } from "@/api/rbac/user";
import { createRecord } from "@/api/bus/record";
import dayjs from "dayjs";
export default {
  name: `record_page`,
  data() {
    var self = this;
    return {
      formModel: {
        mode: "create",
        fields: {
          fId: -1,
          fBillNo: "",
          fDate: dayjs(new Date()).format("YYYY-MM-DD"),
          fCustomId: -1,
          fsalesmanId: -1,
          fisCommisionV: "1",
          fremark: "",
          fisAudit: 0,
        },
        rules: [
          {
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
                type: "string",
                required: true,
                message: "请选择日期",
                min: 3,
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
        ],
      },
      softwares: [],
      columns: [
        {
          width: 250,
          key: "FSoftwareId",
          title: "软件系列",
          align: "center",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h("div", [
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
            ]);
          },
        },
        {
          width: 250,
          key: "FModule",
          title: "模块明细",
          align: "center",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h("div", [
              h(
                "Input",
                {
                  props: {
                    step: 1,
                    value: this.list[index][key],
                  },
                  style: {
                    width: "80%",
                  },
                  on: {
                    input: (val) => {
                      this.list[index][key] = val;
                    },
                  },
                },
                " "
              ),
            ]);
          },
        },
        {
          width: 150,
          key: "FContractPrice",
          title: "合同总金额",
          align: "right",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h("div", [
              h(
                "InputNumber",
                {
                  props: {
                    step: 1,
                    min: 0,
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
            ]);
          },
        },
        {
          width: 150,
          key: "FStandardPrice",
          title: "模块标准价",
          align: "right",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h("div", [
              h(
                "InputNumber",
                {
                  props: {
                    step: 1,
                    min: 0,
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
            ]);
          },
        },
        {
          width: 150,
          key: "FDcRate",
          title: "成交折扣",
          align: "center",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h("div", [
              h(
                "InputNumber",
                {
                  props: {
                    step: 0.01,
                    min: 0,
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
            ]);
          },
        },
        {
          width: 150,
          key: "FPoints",
          title: "本单积分",
          align: "center",
          render: (h, params) => {
            const {
              row,
              column: { key },
              index,
            } = params;
            return h("div", [
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
            ]);
          },
        },
      ],
      form: {
        FSoftwareId: -1,
        FModule: "",
        FContractPrice: 0,
        FStandardPrice: 0,
        FDcRate: 0,
        FPoints: 0,
      },
      list: [],
      customs: [],
      salesmans: [],
      curSelectRowIndex: -1,
      curSelectRow: {},
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
    initBillNo() {
      genBillNo({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.formModel.fields.fBillNo = data;
        }
      });
    },
    initCustom() {
      getAllCustom({}).then(({ data: { state, data } }) => {
        if (state == `success`) {
          this.customs = data;
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
        if (this.formModel.mode === "create") {
          this.doCreateRecord();
        }
        if (this.formModel.mode === "edit") {
          this.doEditSaleMan();
        }
      }
    },
    doCreateRecord() {
      createRecord(
        Object.assign(
          {},
          { form: this.formModel.fields },
          {
            fomr: {
              fisCommision: this.formModel.fields.fisCommisionV == "1" ? 1 : 0,
            },
          },
          { Entry: this.list }
        )
      ).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    beforeSave() {
      if (this.list.length <= 0 || this.list.some((f) => f.FSoftwareId == -1)) {
        return this.$Message.error("表体信息不完整!");
      }
    },
  },
  mounted() {
    this.loadSoftWareList();
    this.initBillNo();
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