<template>
    <!-- <div class="query-root">{{ data }}</div> -->
    <div class="dateTime">
        <button class="itemButton  itemButtonLeft" @click="previousHandler"> <i class="el-icon-arrow-left"></i>
        </button>
        <el-date-picker prefix-icon="'" popper-class="dateTimePopr" ref="datePicker" v-model="timeDate" type="date"
            placeholder="选择日期" @change="pickDateFn">
        </el-date-picker><button @click="nextHandler" class="itemButton itemButtonRight"><i
                class="el-icon-arrow-right"></i> </button>
    </div>

</template>
  
<script>
export default {
    name: "Query",
    props: {
        customConfig: Object,
    },
    data() {
        return {
            data: this.customConfig.data,
            timeDate: '',
            status: false,
            queryDate: [],
            queryProps: this.customConfig?.queryProps
        };
    },
    watch: {
        timeDate: {
            handler(val) {


            },
            deep: true,
            // immediate: true
        },
        "queryProps.value": {
            handler(val) {
                if (val.length == 0) {
                    this.timeDate = ''
                } else {
                    this.timeDate = new Date(val[0].value)
                }




            },
            deep: true,
            immediate: true
        }
    },
    methods: {


        previousHandler() {
            this.timeDate = this.timeDate || new Date()
            let lastDay = new Date(this.timeDate.getTime() - (60 * 60 * 24 * 1000))
            this.timeDate = new Date(lastDay)
            this.watchQueryDate()


        },
        nextHandler() {
            this.timeDate = this.timeDate || new Date()
            let nextDay = new Date(this.timeDate.getTime() + (60 * 60 * 24 * 1000))
            this.timeDate = new Date(nextDay)
            this.watchQueryDate()
        },
        watchQueryDate() {
            const { onChange } = this.queryProps
            let value = []
            if (this.timeDate) {
                this.queryDate[0] = new Date(new Date(this.timeDate.toLocaleDateString()).getTime()).getTime();
                this.queryDate[1] = new Date(new Date(this.timeDate.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();

                value = [{
                    colId: this.queryProps.data.id,
                    coLName: this.queryProps.data.label,
                    value: this.queryDate[0],
                    type: 111
                }, {
                    colId: this.queryProps.data.id,
                    coLName: this.queryProps.data.label,
                    value: this.queryDate[1],
                    type: 113
                }]
            }

            onChange(value);
        },
        pickDateFn() {
            this.watchQueryDate()
        }

    }
};
</script>
  
<style lang="less" scoped>
.query-root {
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    color: #606266;
}

.dateTime {
    display: flex;
    // justify-content: center;

    .itemButton {
        height: 32px;
        background-color: transparent;
        border: 1px solid #DCDFE6;
        cursor: pointer;
        font-size: 20px;
        font-weight: 700;

        display: flex;
        // justify-content: center;
        // align-content: center;

        &:hover {
            color: cornflowerblue;

        }

        /deep/.el-icon-arrow-left {
            line-height: 28px;
        }

        /deep/.el-icon-arrow-right {
            line-height: 28px;
        }
    }

    .itemButtonRight {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: none;
    }

    .itemButtonLeft {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: none;
    }

    /deep/.el-date-editor {
        width: calc(70% - 53px);
        height: 32px;

        .el-input__icon {
            line-height: 32px;
        }
    }

    /deep/.el-input__inner {
        border-radius: 0px;
        border-left: none;
        border-right: none;
        text-align: center;
        height: 32px;
        // width: calc(100% - 53px);
        padding: 0px;

        &:hover {
            border-color: #DCDFE6;
        }

        &:focus {
            border-color: #DCDFE6;
        }
    }
}
</style>
  