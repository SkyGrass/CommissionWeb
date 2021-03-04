<template>
  <div>
    <Card>
      <dz-table
        :totalCount="stores.custom.query.totalCount"
        :pageSize="stores.custom.query.pageSize"
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
                      v-model="stores.custom.query.kw"
                      placeholder="输入关键字搜索..."
                      @on-search="handleSearchUser()"
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.custom.query.isDeleted"
                        @on-change="handleSearchUser"
                        placeholder="删除状态"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.custom.sources.isDeletedSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                      <Select
                        slot="prepend"
                        v-model="stores.custom.query.status"
                        @on-change="handleSearchUser"
                        placeholder="客户状态"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.custom.sources.statusSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                    </Input>
                  </FormItem>
                </Form>
              </Col>
              <Col span="8" class="dnc-toolbar-btns">
                <ButtonGroup class="mr3">
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
                  icon="md-create"
                  type="primary"
                  @click="handleShowCreateWindow"
                  title="新增客户"
                  >新增客户</Button
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
          :data="stores.custom.data"
          :columns="stores.custom.columns"
          @on-select="handleSelect"
          @on-selection-change="handleSelectionChange"
          @on-refresh="handleRefresh"
          :row-class-name="rowClsRender"
          @on-page-change="handlePageChanged"
          @on-page-size-change="handlePageSizeChanged"
          @on-sort-change="handleSortChange"
        >
          <template slot-scope="{ row, index }" slot="status">
            <Tag :color="renderStatus(row.status).color">{{
              renderStatus(row.status).text
            }}</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Poptip
              confirm
              :transfer="true"
              title="确定要删除吗?"
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
            <!-- <Tooltip placement="top" content="查看卡号" :delay="1000" :transfer="true">
              <Button v-can="'edit'" type="warning" size="small" shape="circle" icon="md-lock" @click="handleCheckCardNo(row)"></Button>
            </Tooltip> -->
          </template>
        </Table>
      </dz-table>
    </Card>
    <Drawer
      :title="formTitle"
      v-model="formModel.opened"
      width="600"
      :mask-closable="false"
      :mask="true"
      :styles="styles"
    >
      <Form
        :model="formModel.fields"
        ref="formCustom"
        :rules="formModel.rules"
        label-position="top"
      >
        <Row :gutter="16">
          <Col span="8">
            <FormItem label="客户编码" prop="code">
              <Input
                v-model="formModel.fields.code"
                placeholder="请输入客户编码"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="客户名称" prop="name">
              <Input
                v-model="formModel.fields.name"
                placeholder="请输入客户名称"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="8">
            <FormItem label="客户联系人" prop="linkName">
              <Input
                v-model="formModel.fields.linkName"
                placeholder="请输入客户联系人"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="客户联系人电话" prop="linkPhone">
              <Input
                v-model="formModel.fields.linkPhone"
                placeholder="请输入客户联系人电话"
                :maxlength="11"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="客户加密卡号" prop="cardNo">
              <Input
                :type="types[iptIndex]"
                v-model="formModel.fields.cardNo"
                placeholder="请输入客户卡号"
              >
                <!-- <Icon :type="typesIcons[iptIndex]" slot="suffix" @click="changeType"/> -->
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="客户状态" label-position="left">
              <!-- <RadioGroup v-model="formModel.fields.status" type="button">
                              <Radio v-for="item in stores.custom.sources.statusFormSources" :label="item.text" :key="item.value"></Radio>
              </RadioGroup>-->
              <i-switch
                size="large"
                v-model="formModel.fields.status"
                :true-value="1"
                :false-value="0"
              >
                <span slot="open">正常</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="备注" label-position="top" prop="description">
          <Input
            type="textarea"
            v-model="formModel.fields.description"
            :rows="4"
            placeholder="客户备注信息"
          />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button
          icon="md-checkmark-circle"
          type="primary"
          @click="handleSubmitCustom"
          >保 存</Button
        >
        <Button
          style="margin-left: 8px"
          icon="md-close"
          @click="formModel.opened = false"
          >取 消</Button
        >
      </div>
    </Drawer>
  </div>
</template>

<script>
import DzTable from "_c/tables/dz-table.vue";
import {
  genCode,
  getCustomList,
  createCustom,
  loadCustom,
  editCustom,
  deleteCustom,
  batchCommand,
} from "@/api/base/custom";
export default {
  name: "custom_page",
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
        custom: {
          query: {
            totalCount: 0,
            pageSize: 20,
            currentPage: 1,
            kw: "",
            isDeleted: 0,
            status: -1,
            sort: [
              {
                direct: "DESC",
                field: "Id",
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
              { value: 0, text: "禁用" },
              { value: 1, text: "正常" },
            ],
            statusFormSources: [
              { value: 0, text: "禁用" },
              { value: 1, text: "正常" },
            ],
          },
          columns: [
            { type: "selection", width: 50, key: "handle" },
            { title: "客户编码", key: "code", width: 100, sortable: true },
            { title: "客户名称", key: "name", width: 150 },
            { title: "客户联系人", key: "linkName", width: 100 },
            { title: "客户联系人电话", key: "linkPhone", width: 150 },
            { title: "客户加密卡号", key: "cardNo", width: 150 },
            {
              title: "状态",
              key: "status",
              align: "center",
              width: 120,
              slot: "status",
            },
            {
              title: "创建时间",
              width: 150,
              ellipsis: true,
              tooltip: true,
              key: "createdOn",
            },
            { title: "创建者", key: "createdByUserName" },
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
    };
  },
  computed: {
    formTitle() {
      if (this.formModel.mode === "create") {
        return "创建客户";
      }
      if (this.formModel.mode === "edit") {
        return "编辑客户";
      }
      return "";
    },
    selectedRows() {
      return this.formModel.selection;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.id);
    },
  },
  methods: {
    loadCustomList() {
      getCustomList(this.stores.custom.query).then((res) => {
        this.stores.custom.data = res.data.data;
        this.stores.custom.query.totalCount = res.data.totalCount;
      });
    },
    initCode() {
      genCode({}).then((res) => {
        if (res.data.state == "success") {
          this.formModel.fields.code = res.data.data;
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    handleOpenFormWindow() {
      this.formModel.opened = true;
    },
    handleCloseFormWindow() {
      this.formModel.opened = false;
    },
    handleSwitchFormModeToCreate() {
      this.formModel.mode = "create";
      this.initCode();
    },
    handleSwitchFormModeToEdit() {
      this.formModel.mode = "edit";
      this.handleOpenFormWindow();
    },
    handleEdit(row) {
      this.handleSwitchFormModeToEdit();
      this.handleResetFormCustom();
      this.doLoadCustom(row.id);
    },
    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadCustomList();
    },
    handleShowCreateWindow() {
      this.handleSwitchFormModeToCreate();
      this.handleOpenFormWindow();
      this.handleResetFormCustom();
    },
    handleSubmitCustom() {
      let valid = this.validateUserForm();
      if (valid) {
        if (this.formModel.mode === "create") {
          this.doCreateCustom();
        }
        if (this.formModel.mode === "edit") {
          this.doEditCustom();
        }
      }
    },
    handleResetFormCustom() {
      this.$refs["formCustom"].resetFields();
    },
    doCreateCustom() {
      createCustom(this.formModel.fields).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.handleCloseFormWindow();
          this.loadCustomList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doEditCustom() {
      editCustom(this.formModel.fields).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.handleCloseFormWindow();
          this.loadCustomList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    validateUserForm() {
      let _valid = false;
      this.$refs["formCustom"].validate((valid) => {
        if (!valid) {
          this.$Message.error("请完善表单信息");
        } else {
          _valid = true;
        }
      });
      return _valid;
    },
    doLoadCustom(id) {
      loadCustom({ id: id }).then((res) => {
        this.formModel.fields = res.data.data;
      });
    },
    handleDelete(row) {
      this.doDelete(row.id);
    },
    doDelete(ids) {
      if (!ids) {
        this.$Message.warning("请选择至少一条数据");
        return;
      }
      deleteCustom(ids).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadCustomList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    handleBatchCommand(command) {
      if (!this.selectedRowsId || this.selectedRowsId.length <= 0) {
        this.$Message.warning("请选择至少一条数据");
        return;
      }
      this.$Modal.confirm({
        title: "操作提示",
        content:
          "<p>确定要执行当前 [" +
          this.commands[command].title +
          "] 操作吗?</p>",
        loading: true,
        onOk: () => {
          this.doBatchCommand(command);
        },
      });
    },
    doBatchCommand(command) {
      batchCommand({
        command: command,
        ids: this.selectedRowsId.join(","),
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadCustomList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
        this.$Modal.remove();
      });
    },
    handleSearchUser() {
      this.loadCustomList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handleSortChange(column) {
      this.stores.custom.query.sort.direction = column.order;
      this.stores.custom.query.sort.field = column.key;
      this.loadPostList();
    },
    handlePageChanged(page) {
      this.stores.custom.query.currentPage = page;
      this.loadCustomList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.custom.query.pageSize = pageSize;
      this.loadCustomList();
    },
    renderOwnedRoles(item) {
      return item.label;
    },
    renderStatus(status) {
      let _status = {
        color: "success",
        text: "正常",
      };
      switch (status) {
        case 0:
          _status.text = "禁用";
          _status.color = "error";
          break;
      }
      return _status;
    },
    changeType() {
      this.iptIndex = ~this.iptIndex + 2;
    },
    handleCheckCardNo({ cardNo }) {
      alert(cardNo);
    },
  },
  mounted() {
    this.loadCustomList();
  },
};
</script>

<style>
</style>
