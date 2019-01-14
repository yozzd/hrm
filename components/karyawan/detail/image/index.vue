<template>
    <div>
        <Upload :before-upload="handleUpload" action="graphql">
        <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
        </Upload>
        <div v-if="file !== null">Upload file: {{ file.name }}
            <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button>
        </div>
        {{karyawanDetail}}
    </div>
</template>

<script>
import { KARYAWAN_IMAGE, KARYAWAN_UPDATE_IMAGE } from '@/apollo/queries/karyawan'
import errorHandler from '@/apollo/config/errorHandler'

export default {
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
