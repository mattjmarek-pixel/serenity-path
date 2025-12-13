export interface BigBookChapter {
  id: number;
  title: string;
  summary: string;
  content: string[];
  keyQuotes: string[];
}

export const bigBookChapters: BigBookChapter[] = [
  {
    id: 1,
    title: "Bill's Story",
    summary: "Bill Wilson, co-founder of AA, shares his personal journey from a successful businessman to the depths of alcoholism, and his eventual path to recovery.",
    content: [
      "Bill W. describes his early life and how his drinking progressed from social drinking to severe alcoholism. Despite professional success, alcohol became his master.",
      "He recounts his struggles, hospitalizations, and the despair that came with repeated failed attempts to stop drinking.",
      "The turning point came when an old drinking friend visited him, now sober, and shared his spiritual experience. This encounter planted the seed of hope.",
      "Bill describes his own spiritual awakening in the hospital, which marked the beginning of his recovery and the foundation of Alcoholics Anonymous.",
    ],
    keyQuotes: [
      "We alcoholics are men and women who have lost the ability to control our drinking.",
      "I was to know happiness, peace, and usefulness, in a way of life that is incredibly more wonderful as time passes.",
      "Simple, but not easy; a price had to be paid. It meant destruction of self-centeredness.",
    ],
  },
  {
    id: 2,
    title: "There Is a Solution",
    summary: "This chapter explains that alcoholism is more than just a moral failing—it's an illness—and presents the program of recovery as the solution.",
    content: [
      "The chapter opens by acknowledging that the reader may be skeptical, but assures them that those in AA were once in the same position.",
      "Alcoholism is described as a physical allergy combined with a mental obsession. The alcoholic cannot safely drink in moderation.",
      "The solution presented is a spiritual one—not necessarily religious—but a fundamental change in attitude and approach to life.",
      "The program is based on shared experience, and helping other alcoholics is a key component of maintaining sobriety.",
    ],
    keyQuotes: [
      "The tremendous fact for every one of us is that we have discovered a common solution.",
      "We have found much of heaven and we have been rocketed into a fourth dimension of existence of which we had not even dreamed.",
      "The feeling of having shared in a common peril is one element in the powerful cement which binds us.",
    ],
  },
  {
    id: 3,
    title: "More About Alcoholism",
    summary: "A deeper look at the nature of alcoholism, emphasizing the mental obsession that drives alcoholics to drink despite knowing the consequences.",
    content: [
      "This chapter dispels the idea that willpower alone can overcome alcoholism. The alcoholic's mind plays tricks that lead back to drinking.",
      "Examples are given of alcoholics who convinced themselves they could drink safely, only to find themselves in the grip of alcohol again.",
      "The insanity of alcoholism is explained—doing the same thing expecting different results, believing 'this time will be different.'",
      "The only solution for true alcoholics is complete abstinence, supported by a spiritual program of recovery.",
    ],
    keyQuotes: [
      "The idea that somehow, someday he will control and enjoy his drinking is the great obsession of every abnormal drinker.",
      "We learned that we had to fully concede to our innermost selves that we were alcoholics. This is the first step in recovery.",
      "Once more: the alcoholic at certain times has no effective mental defense against the first drink.",
    ],
  },
  {
    id: 4,
    title: "We Agnostics",
    summary: "Addresses those who struggle with the spiritual aspects of the program, showing that faith doesn't require traditional religious beliefs.",
    content: [
      "Many newcomers to AA struggle with the idea of relying on a 'Higher Power.' This chapter addresses those concerns directly.",
      "The chapter argues that even the most skeptical person can find a conception of a power greater than themselves that works for them.",
      "Faith is presented not as blind belief, but as a willingness to try something new and trust in a process that has worked for others.",
      "The key is an open mind and a willingness to let go of old ideas that haven't served us well.",
    ],
    keyQuotes: [
      "We found that as soon as we were able to lay aside prejudice and express even a willingness to believe in a Power greater than ourselves, we commenced to get results.",
      "We needed to ask ourselves but one short question: 'Do I now believe, or am I even willing to believe, that there is a Power greater than myself?'",
      "When we became alcoholics, crushed by a self-imposed crisis we could not postpone or evade, we had to fearlessly face the proposition that either God is everything or else He is nothing.",
    ],
  },
  {
    id: 5,
    title: "How It Works",
    summary: "The heart of the program—introducing the Twelve Steps as the path to recovery and outlining how to work them.",
    content: [
      "This chapter presents the Twelve Steps in detail, explaining each one and its purpose in the recovery process.",
      "Honesty is emphasized as essential—those who are unwilling to be honest with themselves cannot recover.",
      "The Fourth Step inventory is explained as a searching and fearless moral inventory of ourselves.",
      "Instructions are given for working with a sponsor and making amends to those we have harmed.",
    ],
    keyQuotes: [
      "Rarely have we seen a person fail who has thoroughly followed our path.",
      "Half measures availed us nothing. We stood at the turning point. We asked His protection and care with complete abandon.",
      "We will suddenly realize that God is doing for us what we could not do for ourselves.",
    ],
  },
  {
    id: 6,
    title: "Into Action",
    summary: "Practical guidance on working the Steps, including how to do a Fourth Step inventory, Fifth Step confession, and make amends.",
    content: [
      "The chapter provides detailed instructions on how to take a personal inventory, examining resentments, fears, and harms done to others.",
      "The Fifth Step—admitting our wrongs to God, ourselves, and another person—is explained as a liberating experience.",
      "Making direct amends to those we have harmed is discussed, with guidance on when to proceed and when restraint is needed.",
      "The importance of continued self-examination, prayer, and meditation is emphasized for maintaining sobriety.",
    ],
    keyQuotes: [
      "We pocket our pride and go to it, illuminating every twist of character, every dark cranny of the past.",
      "If we are painstaking about this phase of our development, we will be amazed before we are half way through.",
      "And we have ceased fighting anything or anyone—even alcohol.",
    ],
  },
  {
    id: 7,
    title: "Working with Others",
    summary: "The importance of carrying the message to other alcoholics and how to approach those who are still suffering.",
    content: [
      "Helping other alcoholics is presented as vital to one's own recovery. The message must be carried to those who still suffer.",
      "Practical advice is given on how to approach someone who may be alcoholic, emphasizing attraction rather than promotion.",
      "The importance of not forcing the program on anyone is stressed—the alcoholic must want help.",
      "Stories are shared of successful interventions and the joy that comes from helping another person find sobriety.",
    ],
    keyQuotes: [
      "Practical experience shows that nothing will so much insure immunity from drinking as intensive work with other alcoholics.",
      "Remember that we deal with alcohol—cunning, baffling, powerful!",
      "Burn the idea into the consciousness of every man that he can get well regardless of anyone.",
    ],
  },
  {
    id: 8,
    title: "To Wives",
    summary: "Written for the wives of alcoholics, offering understanding, hope, and practical suggestions for supporting recovery.",
    content: [
      "This chapter addresses the unique challenges faced by those married to alcoholics.",
      "It acknowledges the fear, frustration, and despair that family members experience.",
      "Practical suggestions are offered for supporting a spouse's recovery without enabling drinking behavior.",
      "Hope is extended that families can heal alongside the alcoholic when the program is embraced.",
    ],
    keyQuotes: [
      "Try not to condemn your alcoholic husband no matter what he says or does. He is just another very sick, unreasonable person.",
      "Never forget that resentment is a deadly hazard to an alcoholic.",
      "Both of you will awaken to a new sense of responsibility for others.",
    ],
  },
  {
    id: 9,
    title: "The Family Afterward",
    summary: "Guidance for families adjusting to life after alcoholism, addressing the challenges and rewards of rebuilding relationships.",
    content: [
      "Recovery affects the entire family, and adjustments must be made by everyone, not just the alcoholic.",
      "Old patterns of behavior and resentments need to be addressed for the family to heal together.",
      "The recovering alcoholic must avoid becoming a 'professional reformer' and allow family members their own pace of healing.",
      "With patience and understanding, families can achieve a happiness and unity they never knew before.",
    ],
    keyQuotes: [
      "We have been speaking to you of serious, sometimes tragic things. We have dealt with alcohol in its worst aspect.",
      "The family will have to harden to the fact that dad may be irresponsible for years.",
      "We grow by our willingness to face and rectify errors and convert them into assets.",
    ],
  },
  {
    id: 10,
    title: "To Employers",
    summary: "Information for employers about alcoholism as a treatable illness and how to handle alcoholic employees constructively.",
    content: [
      "Many employers have written off alcoholic employees as hopeless, but this chapter offers another perspective.",
      "Alcoholism is presented as an illness that can be treated, and many alcoholics become exemplary employees when they recover.",
      "Practical suggestions are given for identifying alcoholism and approaching employees with compassion.",
      "The business case for helping alcoholic employees is made alongside the moral imperative.",
    ],
    keyQuotes: [
      "Perhaps you have such a man in mind. He wants to stop drinking and you want to help him, even if it be only a matter of good business.",
      "A look at the alcoholic in your organization is worth while.",
      "We think this man should be thoroughly probed on his willingness to take Alcoholics Anonymous seriously.",
    ],
  },
  {
    id: 11,
    title: "A Vision for You",
    summary: "The book concludes with a vision of hope—that anyone can recover and join a fellowship of those who have found freedom from alcohol.",
    content: [
      "The final chapter paints a picture of the life that awaits those who embrace the program fully.",
      "Stories are shared of transformed lives, restored families, and newfound purpose.",
      "The fellowship of AA is described as a source of lifelong friendship and support.",
      "A call to action is extended—to carry this message of hope to every alcoholic who still suffers.",
    ],
    keyQuotes: [
      "We shall be with you in the Fellowship of the Spirit, and you will surely meet some of us as you trudge the Road of Happy Destiny.",
      "Abandon yourself to God as you understand God. Admit your faults to Him and to your fellows.",
      "God will constantly disclose more to you and to us. Ask Him in your morning meditation what you can do each day for the man who is still sick.",
    ],
  },
];

export const bigBookDisclaimer = "This app provides chapter summaries and key insights for educational purposes only. The complete text of 'Alcoholics Anonymous' is copyrighted. To read the full chapters, please obtain a copy from Alcoholics Anonymous World Services, Inc. or aa.org. This app is not affiliated with or endorsed by AA World Services, Inc.";
