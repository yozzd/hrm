<template>
    <div>
        <child-header v-if="karyawanDetail" :data="karyawanDetail"></child-header>

        <Row type="flex" class="uploadImage">
        <Col :span="18">
        <Upload
            ref="upload"
            :before-upload="handleBeforeUpload"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            action="graphql">
        <Button
            type="dashed"
            custom-icon="iconfont icon-search">Pilih file yang akan di-upload</Button>
        </Upload>
        <div v-if="file !== null">
            <div>Upload file: {{ file.name }}</div>
            <Button
                type="dashed"
                custom-icon="iconfont icon-upload"
                @click="handleUpload"
                :loading="loadingStatus"
                class="uploadButton">{{ loadingStatus ? 'Uploading' : 'Upload' }}</Button>
        </div>
        <Alert
            type="error"
            v-if="errors.length"
            v-for="(error, errorIndex) in errors"
            :key="errorIndex"
            class="errorAlert">{{ error }}</Alert>
        <Modal :title="karyawanDetail.image.filename" v-model="visible">
        <img :src="karyawanDetail.image.path" v-if="visible" style="width: 100%">
        <div slot="footer">
            <Button type="text" @click="handleClose">Tutup</Button>
        </div>
        </Modal>
        </Col>
        <Col :span="6">
        <Row type="flex" justify="end">
        <a v-if="karyawanDetail.image.path" @click="handleView" class="handleView">
            <img :src="karyawanDetail.image.path" class="imgThumbnail"/>
        </a>
        <div v-else class="noImageContainer">
            <img class="imgThumbnail" />
            <div class="centered">No Image</div>
        </div>
        </Row>
        </Col>
        </Row>
    </div>
</template>

<script>
import { KARYAWAN_IMAGE, KARYAWAN_UPDATE_IMAGE } from '@/apollo/queries/karyawan'
import ChildHeader from '@/components/karyawan/child-header'
import errorHandler from '@/apollo/config/errorHandler'

export default {
    components: {
        ChildHeader
    },
    data () {
        return {
            karyawanDetail: {
                image: {
                    path: null
                }
            },
            errors: [],
            file: null,
            visible: false,
            loadingStatus: false
        }
    },
    apollo: {
        $client: 'upload',
        karyawanDetail: {
            query: KARYAWAN_IMAGE,
            variables() {
                return {
                    id: this.$route.params.id
                }
            }
        }
    },
    methods: {
        handleView() {
            this.visible = true
        },
        handleBeforeUpload(file) {
            this.errors = []
            this.file = file
        },
        handleFormatError(file) {
            this.file = null
            this.errors = [`Format file '${file.name}' salah, silahkan pilih format jpg atau png`]
        },
        handleMaxSize(file) {
            this.file = null
            this.errors = [`File '${file.name}' melebihi batas maksimum 2Mb`]
        },
        handleClose() {
            this.visible = false
        },
        handleUpload: async function() {
            const client = this.$apolloProvider.clients.upload
            this.loadingStatus = true
            try {
                const { data } = await client.mutate({
                    mutation: KARYAWAN_UPDATE_IMAGE,
                    variables: {
                        id: this.$route.params.id,
                        image: this.file
                    },
                    update: (store, { data: { karyawanImageUpdate } }) => {
                        const data = store.readQuery({
                            query: KARYAWAN_IMAGE,
                            variables: { id: this.$route.params.id }
                        })
                        const merge = _.merge(data, _.merge(data.karyawanDetail, karyawanImageUpdate))
                        store.writeQuery({
                            query: KARYAWAN_IMAGE,
                            variables: { id: this.$route.params.id },
                            data: merge
                        })
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        karyawanImageUpdate: {
                            __typename: 'KaryawanType',
                            id: this.$route.params.id,
                            image: {
                                __typename: 'KaryawanImageType',
                                path: '',
                                filename: ''
                            }
                        }
                    }
                })
                if(data.karyawanImageUpdate) {
                    this.file = null
                    this.loadingStatus = false
                    this.$Notice.success({
                        title: 'Sukses',
                        desc: `Data karyawan "${this.karyawanDetail.no}" berhasil diperbaharui`
                    })
                }
            } catch(err) {
                this.errors = errorHandler(err)
            }
        }
    }
}
</script>

<style scoped>
.uploadImage,
.errorAlert {
    margin-top: 20px;
}
.uploadButton {
    margin-top: 80px;
}
.imgThumbnail {
    width: 150px;
    height: 200px;
    border-radius: .25rem!important;
}
.noImageContainer {
    position: relative;
    text-align: center;
    color: #777777;
}
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
a.handleView:hover {
    opacity: .9;
}
</style>
