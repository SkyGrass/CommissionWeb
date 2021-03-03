<template>
  <div>
    <Card>
      <dz-table
        :totalCount="stores.usersalesman.query.totalCount"
        :pageSize="stores.usersalesman.query.pageSize"
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
                      v-model="stores.usersalesman.query.kw"
                      placeholder="输入关键字搜索..."
                      @on-search="handleSearchUser()"
                    >
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
                  title="新增绑定"
                  >新增绑定</Button
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
          :data="stores.usersalesman.data"
          :columns="stores.usersalesman.columns"
          @on-select="handleSelect"
          @on-selection-change="handleSelectionChange"
          @on-refresh="handleRefresh"
          :row-class-name="rowClsRender"
          @on-page-change="handlePageChanged"
          @on-page-size-change="handlePageSizeChanged"
          @on-sort-change="handleSortChange"
        >
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
          </template>
        </Table>
      </dz-table>
    </Card>
  </div>
</template>

<script>
import DzTable from "_c/tables/dz-table.vue";
import {
  getUserSalesmanMappingList,
  deleteUserSalesmanMapping,
  batchCommand,
} from "@/api/base/usmapping";
import dayjs from "dayjs";
export default {
  name: "user_salesman_mapping_page",
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
        title: "创建软件产品",
        mode: "create",
        selection: [],
        fields: {
          id: -1,
          code: "",
          name: "",
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
              message: "请输入软件产品编码",
              min: 1,
            },
          ],
          name: [
            {
              type: "string",
              required: true,
              message: "请输入软件产品名称",
              min: 2,
            },
          ],
        },
      },
      stores: {
        usersalesman: {
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
          columns: [
            { type: "selection", width: 50, key: "handle" },
            {
              title: "业务员编码",
              key: "salesmanCode",
              width: 130,
              sortable: true,
            },
            { title: "业务员姓名", key: "salesmanName", width: 150 },
            { title: "账户名称", key: "userName", width: 150 },
            {
              title: "创建时间",
              width: 150,
              ellipsis: true,
              tooltip: true,
              key: "createdOn",
              render: (h, params) => {
                const {
                  row: { createdOn },
                  index,
                } = params;

                return h("div", [
                  h("div", dayjs(createdOn).format("YYYY-MM-DD HH:mm")),
                ]);
              },
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
    };
  },
  computed: {
    selectedRows() {
      return this.formModel.selection;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.id);
    },
  },
  methods: {
    loadUserSalesmanList() {
      getUserSalesmanMappingList(this.stores.usersalesman.query).then((res) => {
        this.stores.usersalesman.data = res.data.data;
        this.stores.usersalesman.query.totalCount = res.data.totalCount;
      });
    },

    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadUserSalesmanList();
    },
    doLoadSoftWare(id) {
      loadSoftWare({ id: id }).then((res) => {
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
      deleteUserSalesmanMapping(ids).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadUserSalesmanList();
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
          this.loadUserSalesmanList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
        this.$Modal.remove();
      });
    },
    handleSearchUser() {
      this.loadUserSalesmanList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handleSortChange(column) {
      this.stores.usersalesman.query.sort.direction = column.order;
      this.stores.usersalesman.query.sort.field = column.key;
    },
    handlePageChanged(page) {
      this.stores.usersalesman.query.currentPage = page;
      this.loadUserSalesmanList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.usersalesman.query.pageSize = pageSize;
      this.loadUserSalesmanList();
    },
    renderOwnedRoles(item) {
      return item.label;
    },
    handleShowCreateWindow() {
      const route = {
        name: "rbac_user_page",
        query: {},
        meta: {
          title: " 用户管理",
        },
      };
      this.$router.push(route);
    },
  },
  mounted() {
    this.loadUserSalesmanList();
  },
};
</script>

<style>
</style>
