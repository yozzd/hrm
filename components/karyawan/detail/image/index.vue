<template>
    <div>
        <child-header v-if="karyawanDetail" :data="karyawanDetail"></child-header>

        <Row type="flex" class="uploadImage">
        <Col :span="18">
        <Upload :before-upload="handleUpload" action="graphql">
        <Button type="dashed" custom-icon="iconfont icon-search">Pilih file yang akan di-upload</Button>
        </Upload>
        <div v-if="file !== null">
            <div>Upload file: {{ file.name }}</div>
            <Button type="dashed" custom-icon="iconfont icon-upload" @click="upload" :loading="loadingStatus" class="uploadButton">{{ loadingStatus ? 'Uploading' : 'Upload' }}</Button>
        </div>
        {{karyawanDetail}}
        </Col>
        <Col :span="6">
        <img v-if="karyawanDetail" :src="karyawanDetail.image.path" class="img_thumbnail"/>
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
            file: null,
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
        handleUpload(file) {
            this.file = file
            return false
        },
        upload: async function() {
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
                console.log(errorHandler(err))
            }
        }
    }
}
</script>

<style scoped>
.uploadImage {
    margin-top: 20px;
}
.uploadButton {
    margin-top: 80px;
}
.img_thumbnail {
    width: 200px;
    border-radius: .25rem!important;
}
</style>
