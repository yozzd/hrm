<template>
    <div>
        <Row type="flex" justify="center" align="middle" class="guard">
            <Col :span="10">
                <div>
                    <Icon custom="iconfont icon-stop" size="80" />
                    <h1>Akses Diblokir</h1>
                    <h4>Anda tidak diizinkan mengakses halaman ini!</h4>
                </div>
            </Col>
        </Row>
    </div>
</template>

<style scoped>
.guard {
  text-align: center;
  height: calc(100vh - 137px);
}
.guard h1 {
  font-size: 30px;
}
</style>
