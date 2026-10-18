export const interviewLanguages=['en-IN','hi-IN','kn-IN','hi-Latn-IN'] as const;
export function speechLocale(language:string){return language==='hi-Latn-IN'?'hi-IN':language;}
export function languageInstruction(language:string){return language==='kn-IN'?'Respond in natural Kannada using Kannada script.':language==='hi-IN'?'Respond in natural Hindi using Devanagari script.':language==='hi-Latn-IN'?'Respond in simple romanized Hindi/Hinglish.':'Respond in simple English.';}
const native:Record<string,[string,string]>={
 symptom:['अपनी दुकान में हाल की किसी भुगतान समस्या के बारे में बताइए। क्या हुआ था?','ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ ಇತ್ತೀಚೆಗೆ ನಡೆದ ಪಾವತಿ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಹೇಳಿ. ಏನಾಯಿತು?'],
 payment_status:['भुगतान नहीं आया से आपका मतलब ऐप में एंट्री, बैंक में रकम, या साउंडबॉक्स की घोषणा है?','ಪಾವತಿ ಬಂದಿಲ್ಲ ಎಂದರೆ ಆ್ಯಪ್‌ನ ದಾಖಲೆ, ಬ್ಯಾಂಕ್‌ಗೆ ಹಣ ಜಮೆಯಾಗುವುದು ಅಥವಾ ಸೌಂಡ್‌ಬಾಕ್ಸ್‌ನ ಘೋಷಣೆಯನ್ನು ಹೇಳುತ್ತಿದ್ದೀರಾ?'],
 settlement:['क्या आपने बैंक में रकम जमा होने की अलग से जाँच की है, या यह अभी पता नहीं है?','ಬ್ಯಾಂಕ್‌ಗೆ ಹಣ ಜಮೆಯಾಗಿದೆಯೇ ಎಂದು ಪ್ರತ್ಯೇಕವಾಗಿ ಪರಿಶೀಲಿಸಿದ್ದೀರಾ, ಅಥವಾ ಇನ್ನೂ ತಿಳಿದಿಲ್ಲವೇ?'],
 frequency:['यह कितनी बार होता है और कब से हो रहा है? अनुमान भी बता सकते हैं।','ಇದು ಎಷ್ಟು ಬಾರಿ ಆಗುತ್ತದೆ ಮತ್ತು ಯಾವಾಗಿನಿಂದ ಆಗುತ್ತಿದೆ? ಅಂದಾಜು ಹೇಳಬಹುದು.'],
 impact:['इससे काउंटर पर क्या असर पड़ता है? क्या बिक्री का नुकसान मापा है या ग्राहकों का इंतज़ार बढ़ता है?','ಇದರಿಂದ ಕೌಂಟರ್‌ನಲ್ಲಿ ಏನು ಪರಿಣಾಮವಾಗುತ್ತದೆ? ಮಾರಾಟದ ನಷ್ಟವನ್ನು ಅಳೆಯಲಾಗಿದೆಯೇ ಅಥವಾ ಗ್ರಾಹಕರ ಕಾಯುವ ಸಮಯ ಹೆಚ್ಚುತ್ತದೆಯೇ?'],
 workaround:['घोषणा न होने पर आप और कर्मचारी भुगतान की पुष्टि कैसे करते हैं?','ಘೋಷಣೆ ಕೇಳಿಸದಾಗ ನೀವು ಮತ್ತು ಸಿಬ್ಬಂದಿ ಪಾವತಿಯನ್ನು ಹೇಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುತ್ತೀರಿ?'],
 attempts:['आपने अब तक क्या कोशिश की और उसके बाद क्या बदला?','ಈಗಾಗಲೇ ಏನು ಪ್ರಯತ್ನಿಸಿದ್ದೀರಿ ಮತ್ತು ನಂತರ ಏನು ಬದಲಾಯಿತು?'],
 constraints:['उपयोगी समाधान में क्या सीमाएँ हैं—फोन, नेटवर्क, समय या कोई जानकारी जिसे निजी रखना है?','ಉಪಯುಕ್ತ ಪರಿಹಾರಕ್ಕೆ ಯಾವ ಮಿತಿಗಳಿವೆ—ಫೋನ್, ಸಂಪರ್ಕ, ಸಮಯ ಅಥವಾ ಖಾಸಗಿಯಾಗಿ ಉಳಿಸಬೇಕಾದ ಮಾಹಿತಿ?'],
 outcome:['आपकी दुकान के लिए उपयोगी सुधार कैसा होगा?','ನಿಮ್ಮ ಅಂಗಡಿಗೆ ಉಪಯುಕ್ತ ಸುಧಾರಣೆ ಹೇಗಿರಬೇಕು?'],
 affected_value:['क्या यह प्रभावित भुगतानों की रकम है या आपने वास्तविक आर्थिक नुकसान की पुष्टि की है?','ಇದು ಸಮಸ್ಯೆಯಾದ ಪಾವತಿಗಳ ಮೊತ್ತವೇ ಅಥವಾ ನಿಜವಾದ ಹಣದ ನಷ್ಟವನ್ನು ಖಚಿತಪಡಿಸಿದ್ದೀರಾ?'],
 contradiction:['पहले आपने ऐप में अलग स्थिति बताई थी। क्या ये एक ही भुगतान की बातें हैं या अलग घटनाएँ हैं?','ಮೊದಲು ಆ್ಯಪ್‌ನಲ್ಲಿ ಬೇರೆ ಸ್ಥಿತಿಯನ್ನು ಹೇಳಿದ್ದಿರಿ. ಇವು ಒಂದೇ ಪಾವತಿಯ ಬಗ್ಗೆ ಹೇಳುತ್ತಿದ್ದೀರಾ ಅಥವಾ ಬೇರೆ ಘಟನೆಗಳೇ?'],
 damage_status:['साउंडबॉक्स खराब होने के बाद भी क्या ऐप में भुगतान की एंट्री दिख रही है?','ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಹಾನಿಯಾದ ನಂತರವೂ ಆ್ಯಪ್‌ನಲ್ಲಿ ಪಾವತಿ ದಾಖಲೆಗಳು ಕಾಣಿಸುತ್ತಿವೆಯೇ?'],
 damage_attempts:['क्या आपने खराब डिवाइस के बारे में सहायता टीम से संपर्क किया है? उसके बाद क्या हुआ?','ಹಾನಿಯಾದ ಸಾಧನದ ಬಗ್ಗೆ ಸಹಾಯ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿದ್ದೀರಾ? ನಂತರ ಏನಾಯಿತು?'],
 finish:['धन्यवाद। मसौदा समीक्षा के लिए तैयार है। अधूरी जानकारी दिखाई गई है। सुधार करें और साझा करने से पहले अनुमति दें।','ಧನ್ಯವಾದಗಳು. ಕರಡು ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧವಾಗಿದೆ. ತಿಳಿಯದ ವಿವರಗಳನ್ನು ತೋರಿಸಲಾಗಿದೆ. ತಿದ್ದುಪಡಿ ಮಾಡಿ, ಹಂಚುವ ಮೊದಲು ಅನುಮೋದಿಸಿ.'],
 injection:['अनुमोदन समीक्षा स्क्रीन पर ही होगा। आपकी दुकान में क्या हुआ था?','ಅನುಮೋದನೆ ಪರಿಶೀಲನಾ ಪರದೆಯಲ್ಲಿ ಮಾತ್ರ ನಡೆಯುತ್ತದೆ. ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ ಏನಾಯಿತು?'],
};
export function localQuestion(key:string,language:string,english:string,romanized?:string):string{
 if(language==='hi-Latn-IN')return romanized||english;
 return native[key]?.[language==='hi-IN'?0:1] && (language==='hi-IN'||language==='kn-IN') ? native[key][language==='hi-IN'?0:1] : english;
}
export function hasRequestedScript(text:string,language:string){return language==='hi-IN'?/[\u0900-\u097f]/u.test(text):language==='kn-IN'?/[\u0c80-\u0cff]/u.test(text):true;}
export function transcriptionInstruction(language:string){return language==='kn-IN'?'The selected interview language is Kannada. Transcribe Kannada in Kannada script, preserving English words as spoken.':language==='hi-IN'?'The selected interview language is Hindi. Transcribe Hindi in Devanagari, preserving English words as spoken.':language==='hi-Latn-IN'?'The selected language is Hinglish. Romanize Hindi words and preserve English words.':'Preserve the spoken language and its native script. Do not translate.';}
export function hasUnexpectedScript(text:string,language:string){
 const allowed=language==='hi-IN'?/[\p{Script=Devanagari}\p{Script=Latin}]/u:language==='kn-IN'?/[\p{Script=Kannada}\p{Script=Latin}]/u:language==='hi-Latn-IN'?/\p{Script=Latin}/u:null;
 return Boolean(allowed&&[...text].some(ch=>/\p{L}/u.test(ch)&&!allowed.test(ch)));
}
