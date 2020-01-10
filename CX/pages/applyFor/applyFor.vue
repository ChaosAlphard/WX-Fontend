<template>
  <view>
    <form @submit="submit" @reset="reset">
      <view class="cu-form-group">
      	<view class="title">输入框</view>
        <text class='cuIcon-locationfill text-orange'></text>
      	<input placeholder="输入信息" name="input" v-model="msgInput"></input>
      </view>

      <button form-type="submit">Submit</button>
      <button form-type="reset">Reset</button>
    </form>
  </view>
</template>

<script>
  export default {
    data: () => ({
      msgInput: ''
    }),
    methods: {
      submit(data) {
        console.log(data)
      },
      reset(data) {
        console.log(data)
      }
    }
  }
</script>

<style scoped>

</style>
