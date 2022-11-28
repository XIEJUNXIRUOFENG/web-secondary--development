export const link_names = [
  {
    label: "JDBC连接串",
    name: "url",
    labelCol: { span: 11 },
    // "jdbc:mysql://[ip]:[port]/[databaseName]?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false",
    initialValue:
      "jdbc:highgo://[ip]:[port]/[database]",
    rules: [
      {
        required: true,
        message: "请输入JDBC连接串",
      },
    ],
  },
  {
    label: "用户名",
    name: "username",
    rules: [
      {
        required: true,
        message: "请输入用户名",
      },
    ],
  },
  {
    label: "密码",
    name: "password",
    type: "password",
    rules: [
      {
        required: true,
        message: "请输入密码",
      },
    ],
  },
  {
    label: "客户端字符集",
    name: "clientEncoding",
    type: "select",
    initialValue: "UTF-8",
    options: [{ value: "UTF-8" }, { value: "GBK" }],
    defaultValue: "UTF-8",
  },
  {
    label: "数据库字符集",
    name: "serverEncoding",
    type: "select",
    initialValue: "AL32UTF8",
    options: [{ value: "AL32UTF8" }, { value: "ZHS16GBK" }],
    defaultValue: "AL32UTF8",
  },
];

export const basic_names = [
  {
    label: "数据源名称",
    name: "name",
    rules: [
      {
        required: true,
        message: "请输入数据源名称",
      },
      {
        max: 24,
        message: "数据源名称过长",
      },
    ],
  },
];
