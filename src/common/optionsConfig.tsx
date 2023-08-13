import { Hotkey } from "./keymap";

interface OptionsConfig {
  // GeneralConfig
  theme?: string;

  // TabGroupsConfig
  hotkey?: Hotkey;
  colorSeparator?: string;
  defaultNames?: string[];
}

const defaultOptionsConfig: OptionsConfig = {
  theme: "dark",
  hotkey: {
    altKey: false,
    code: "KeyO",
    ctrlKey: false,
    key: "o",
    metaKey: true,
    shiftKey: true,
  },
  colorSeparator: "[[",
  defaultNames: [
    "花间一壶酒",
    "独坐敬亭山",
    "海上生明月",
    "天涯共此时",
    "春风细雨微霜",
    "明月几时有",
    "空山不见人",
    "但闻人语响",
    "返景入深林",
    "复照青苔上",
    "白日依山尽",
    "黄河入海流",
    "欲穷千里目",
    "更上一层楼",
    "千山鸟飞绝",
    "万径人踪灭",
    "孤舟蓑笠翁",
    "独钓寒江雪",
    "独坐幽篁里",
    "弹琴复长啸",
    "深林人不知",
    "明月来相照",
    "移舟泊烟渚",
    "日暮客愁新",
    "野旷天低树",
    "江清月近人",
    "红豆生南国",
    "春来发几枝",
    "愿君多采撷",
    "此物最相思",
    "床前明月光",
    "疑是地上霜",
    "举头望明月",
    "低头思故乡",
    "松下问童子",
    "言师采药去",
    "只在此山中",
    "云深不知处",
    "功盖三分国",
    "名成八阵图",
    "江流石不转",
    "遗恨失吞吴",
    "春眠不觉晓",
    "处处闻啼鸟",
    "夜来风雨声",
    "花落知多少",
    "绿蚁新醅酒",
    "红泥小火炉",
    "晚来天欲雪",
    "能饮一杯无",
    "向晚意不适",
    "驱车登古原",
    "夕阳无限好",
    "只是近黄昏",
    "山中相送罢",
    "日暮掩柴扉",
    "春草明年绿",
    "王孙归不归",
  ],
};

async function loadOptionsConfig(): Promise<OptionsConfig> {
  try {
    let { optionsConfig } = await chrome.storage.local.get("optionsConfig");
    if (!optionsConfig) {
      optionsConfig = defaultOptionsConfig;
    } else {
      optionsConfig = { ...defaultOptionsConfig, ...optionsConfig };
    }
    console.log("optionsConfig", optionsConfig);
    await chrome.storage.local.set({ optionsConfig: optionsConfig });
    return optionsConfig;
  } catch (err) {
    console.error(err);
    return defaultOptionsConfig;
  }
}

async function saveOptionsConfig(optionsConfig: OptionsConfig) {
  try {
    await chrome.storage.local.set({ optionsConfig: optionsConfig });
  } catch (err) {
    console.error(err);
  }
}

export { OptionsConfig, loadOptionsConfig, saveOptionsConfig };
