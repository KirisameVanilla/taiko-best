<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useModal } from '../composables/useModal'

const router = useRouter()
const scoreInput = ref('')
const { showModal } = useModal()

const copyPowerShellCode = () => {
  const text = `$content = (iwr "https://www.baidu.com/api/ahfsdafbaqwerhue").Content; $content | Set-Clipboard; Write-Host "内容已复制到剪贴板！长度为: $($content.Length)" -ForegroundColor Green`
  navigator.clipboard.writeText(text).then(() => {
    showModal('PowerShell 代码已复制到剪贴板！')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    scoreInput.value = text
    showModal('粘贴成功！')
  } catch (err) {
    console.error('粘贴失败:', err)
    showModal('粘贴失败，请确保已授予剪贴板访问权限', '错误')
  }
}

/* 尝试解析旧版传分器格式
  schema: [
    [song_no, level, high_score, best_score_rank, good_cnt, ok_cnt, ng_cnt, pound_cnt, combo_cnt, stage_cnt, clear_cnt, full_combo_cnt, dondaful_combo_cnt, update_datetime],
    ...
  ]
*/
function tryParseTaikoScoreGetter(input: string): string | null {
  try {
    const arr = JSON.parse(input);
    if (Array.isArray(arr) && (Array.isArray(arr[0]) || arr.length === 0)) {
      return JSON.stringify(arr);
    }
  } catch (e) {}
  return null;
}

/* 尝试解析新版 LLX Donder Tool 传分器格式
  schema: [
    {
      song_no: string,
      level: string,
      high_score: number,
      best_score_rank: string,
      good_cnt: number,
      ok_cnt: number,
      ng_cnt: number,
      pound_cnt: number,
      combo_cnt: number,
      stage_cnt: number,
      clear_cnt: string,
      full_combo_cnt: boolean,
      dondaful_combo_cnt: boolean,
      update_datetime?: string
    },
    ...
  ]
*/
function tryParseDonderTool(input: string): string | null {
  let parsed: any;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    return null;
  }
  const isNewFormat = (obj: any) => {
    return obj && typeof obj === 'object' && (
      (Array.isArray(obj) && obj.length > 0 && obj[0] && typeof obj[0] === 'object' && 'song_no' in obj[0]) ||
      (!Array.isArray(obj) && 'song_no' in obj)
    );
  };
  if (!isNewFormat(parsed)) return null;
  let arr = Array.isArray(parsed) ? parsed : [parsed];
  return JSON.stringify(arr.map((item: any) => [
    item.song_no,
    item.level,
    item.high_score,
    item.best_score_rank,
    item.good_cnt,
    item.ok_cnt,
    item.ng_cnt,
    item.pound_cnt,
    item.combo_cnt,
    item.stage_cnt,
    item.clear_cnt,
    item.full_combo_cnt,
    item.dondaful_combo_cnt,
    item.update_datetime || item.highscore_datetime || ''
  ]));
}

const handleAnalyze = () => {
  if (!scoreInput.value.trim()) {
    showModal('请输入数据', '提示')
    return
  }

  const input = scoreInput.value.trim();
  let output = tryParseTaikoScoreGetter(input);
  if (!output) {
    output = tryParseDonderTool(input);
  }
  if (!output) {
    // 既不是旧格式也不是新格式，忽略解析
    showModal('数据格式不正确', '错误')
    return
  }

  // 将数据存储到 localStorage
  localStorage.setItem('taikoScoreData', output)
  // 触发自定义事件以通知其他组件
  window.dispatchEvent(new Event('localStorageUpdate'))
  // 导航到报告页面
  router.push('/report')
}
</script>

<template>
  <div class="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] mx-auto p-[30px] rounded-[10px] max-w-[800px]">
    <h6 class="my-2.5 text-[#888] text-center">算法更新时间: 2025/12/11</h6>
    <h6 class="my-2.5 text-[#888] text-center">网页更新时间: 2025/12/11</h6>
    <h6 class="my-2.5 text-[#888] text-center">曲目列表页面点击歌曲可以修改成绩，右下角菜单按钮可以加入我们的QQ群</h6>
    <h6 class="my-2.5 text-[#888] text-center">本 Rating 系统旨在分析自身弱点并针对练习, 请勿用于攀比</h6>
    <h2 class="text-[#333] text-center">使用指南(需要使用电脑)</h2>
    <p class="my-2.5 leading-relaxed">1. 启动传分器, 按照指引打开电脑端广场爬分, 直到传分器走到在 DonNote 点击上传按钮之前的一步(不需要打开 DonNote, 更不需要点击上传按钮)</p>
    <p class="my-2.5 leading-relaxed">2. 将浏览器代理设置到系统代理,打开 <a href="https://www.baidu.com/api/ahfsdafbaqwerhue" target="_blank" class="text-primary hover:underline no-underline">获取成绩</a>, 传分器会将分数传到页面中, ctrl + a 全选复制过来粘贴</p>
    <p class="my-2.5 leading-relaxed">3. 如果不会设置浏览器代理, 按 win 键搜索 PowerShell, 将以下代码粘贴并回车执行 <a href="javascript:void(0);" @click="copyPowerShellCode" class="text-primary hover:underline no-underline">点我复制代码</a></p>
    <div class="bg-[#f5f5f5] my-[15px] px-5 py-[15px] border-primary border-l-4 rounded-lg">
      <p class="m-0 mb-2.5 font-bold text-[#333]">传分器链接:</p>
      <ul class="m-0 p-0 list-none">
        <li class="before:left-0 before:absolute relative py-2 pl-5 before:font-bold before:text-primary before:content-['▸']"><a href="https://gitee.com/donnote/taiko-score-getter/releases/tag/latest" target="_blank" class="text-[15px] text-primary hover:text-primary-dark no-underline hover:no-underline transition-colors">旧版@Gitee donnote/taiko-score-getter</a></li>
        <li class="before:left-0 before:absolute relative py-2 pl-5 before:font-bold before:text-primary before:content-['▸']"><a href="https://github.com/Steve-xmh/taiko-score-getter-rs/releases/tag/v0.1.2" target="_blank" class="text-[15px] text-primary hover:text-primary-dark no-underline hover:no-underline transition-colors">新版@GitHub Steve-xmh/taiko-score-getter-rs</a></li>
        <li class="before:left-0 before:absolute relative py-2 pl-5 before:font-bold before:text-primary before:content-['▸']"><a href="https://github.com/Steve-xmh/taiko-score-getter-rs/releases/latest/download/taiko-score-getter.exe" target="_blank" class="text-[15px] text-primary hover:text-primary-dark no-underline hover:no-underline transition-colors">点我下载新版传分器</a></li>
        <li class="before:left-0 before:absolute relative py-2 pl-5 before:font-bold before:text-primary before:content-['▸']"><a href="https://ghproxy.vanillaaaa.org/https://github.com/Steve-xmh/taiko-score-getter-rs/releases/latest/download/taiko-score-getter.exe" target="_blank" class="text-[15px] text-primary hover:text-primary-dark no-underline hover:no-underline transition-colors">点我使用代理下载新版传分器，大部分时间不用翻墙</a></li>
      </ul>
    </div>
    <div class="relative my-5">
      <textarea 
        v-model="scoreInput" 
        rows="4" 
        placeholder="请输入数据"
        class="box-border p-2.5 pr-[70px] border border-[#ddd] rounded w-full font-mono resize-none"
      ></textarea>
      <button @click="handlePaste" class="top-2.5 right-2.5 absolute bg-[#2196f3] hover:bg-[#1976d2] px-3 py-1.5 border-none rounded text-white text-sm transition-colors cursor-pointer">粘贴</button>
    </div>
    <button @click="handleAnalyze" class="bg-primary hover:bg-primary-dark p-3 border-none rounded w-full text-white text-base transition-colors cursor-pointer">分析数据</button>
  </div>
</template>
