import{a as R,b as U,c as H,d as G,e as X,f as j,g as q,h as Y,i as J,j as Q,k as K,l as Z,m as $,n as ee,o as te,p as ie,q as ne,r as ae,s as oe,t as re,u as le,v as de,w as me,x as se,y as ce}from"./chunk-UUU7BI2K.js";import{c as B,f as W,m as V,n as A}from"./chunk-XIAE3S6L.js";import{a as F,b as N}from"./chunk-W67SSUM4.js";import"./chunk-23TWDL4C.js";import"./chunk-5XPIWXNK.js";import{$a as r,Ab as w,Db as u,Eb as p,Fb as g,Ib as k,Ka as I,Lb as x,Mb as E,Va as M,Wa as P,Ya as h,Za as v,_a as S,ab as e,ba as y,bb as t,ca as _,cb as d,jb as z,jc as O,kc as D,la as T,lb as b,nb as C,nc as L,yb as i,za as a,zb as f}from"./chunk-XVADYIPR.js";var ue=()=>[],ge=()=>[1,2,3,4];function be(m,c){if(m&1&&(e(0,"ui-button",27),i(1),x(2,"titlecase"),t()),m&2){let l=c.$implicit;r("variant",l),a(),f(E(2,2,l))}}function he(m,c){if(m&1&&(e(0,"ui-button",28),i(1),x(2,"titlecase"),t()),m&2){let l=c.$implicit;r("color",l),a(),f(E(2,2,l))}}function ve(m,c){if(m&1&&(e(0,"ui-button",30),i(1),x(2,"uppercase"),t()),m&2){let l=c.$implicit;r("size",l),a(),f(E(2,2,l))}}function Se(m,c){if(m&1&&(e(0,"ui-icon-button",54),x(1,"titlecase"),e(2,"mat-icon"),i(3,"favorite"),t()()),m&2){let l=c.$implicit;r("color",l)("ariaLabel",l)("tooltip",E(1,3,l))}}function xe(m,c){if(m&1&&(e(0,"ui-badge",28),i(1),x(2,"titlecase"),t()),m&2){let l=c.$implicit;r("color",l),a(),f(E(2,2,l))}}function Ee(m,c){if(m&1&&(e(0,"ui-badge",58),i(1),x(2,"uppercase"),t()),m&2){let l=c.$implicit;r("size",l),a(),f(E(2,2,l))}}function fe(m,c){if(m&1&&(e(0,"ui-badge",59),i(1),x(2,"titlecase"),t()),m&2){let l=c.$implicit;r("color",l),a(),f(E(2,2,l))}}function Ce(m,c){if(m&1&&(e(0,"ui-badge",60),i(1),x(2,"titlecase"),t()),m&2){let l=c.$implicit;r("color",l),a(),f(E(2,2,l))}}function ye(m,c){if(m&1&&(d(0,"ui-stat-card",118),x(1,"titlecase")),m&2){let l=c.$implicit;r("label",E(1,5,l))("value",1234)("color",l)("showTrend",!0)("trendValue",5.2)}}function _e(m,c){if(m&1&&d(0,"ui-avatar",160),m&2){let l=c.$implicit;r("initials",l.slice(0,2).toUpperCase())("color",l)}}function we(m,c){if(m&1&&(e(0,"div",182),d(1,"ui-spinner",212),e(2,"p",184),i(3),x(4,"titlecase"),t()()),m&2){let l=c.$implicit;a(),r("color",l),a(2),f(E(4,2,l))}}function ke(m,c){m&1&&(e(0,"div",206),d(1,"ui-skeleton",213),e(2,"div",214),d(3,"ui-skeleton",203)(4,"ui-skeleton",215),t()())}function Te(m,c){if(m&1){let l=z();e(0,"ui-modal",216),b("closed",function(){y(l);let s=C();return _(s.closeModal())}),e(1,"p"),i(2),t(),e(3,"p"),i(4,"Click outside or press ESC to close."),t(),e(5,"div",217)(6,"ui-button",218),b("click",function(){y(l);let s=C();return _(s.closeModal())}),i(7,"Cancel"),t(),e(8,"ui-button",138),b("click",function(){y(l);let s=C();return _(s.closeModal())}),i(9,"Confirm"),t()()()}if(m&2){let l=C();r("isOpen",l.isModalOpen())("size",l.modalSize)("showCloseButton",!0),a(2),w("This is a ",l.modalSize," modal dialog. You can put any content here.")}}function Me(m,c){if(m&1){let l=z();e(0,"ui-toast",219),b("dismissed",function(){y(l);let s=C();return _(s.hideToast())}),t()}if(m&2){let l=C();r("message","This is a "+l.toastColor+" notification!")("color",l.toastColor)("title",l.toastColor==="success"?"Success!":l.toastColor==="danger"?"Error!":l.toastColor==="warning"?"Warning!":"Info")("duration",4e3)("showProgress",!0)}}var pe=class m{inputValue="";textareaValue="";selectedOption="";checkboxValue=!1;radioValue="option1";toggleValue=!1;passwordValue="";demoCheckboxPrimary=!0;demoCheckboxSecondary=!0;demoCheckboxAccent=!0;demoCheckboxSuccess=!0;demoCheckboxWarning=!0;demoCheckboxDanger=!0;demoTogglePrimary=!0;demoToggleSecondary=!0;demoToggleAccent=!0;demoToggleSuccess=!0;demoToggleWarning=!0;demoToggleDanger=!0;isModalOpen=T(!1);modalSize="md";showToast=T(!1);toastColor="success";isLoading=!1;selectOptions=[{value:"angular",label:"Angular"},{value:"react",label:"React"},{value:"vue",label:"Vue.js"},{value:"svelte",label:"Svelte"},{value:"nextjs",label:"Next.js"}];tabItems=[{id:"overview",label:"Overview",icon:"\u{1F4CB}"},{id:"features",label:"Features",icon:"\u2728"},{id:"docs",label:"Documentation",icon:"\u{1F4DA}"},{id:"examples",label:"Examples",icon:"\u{1F4A1}"}];tabItems2=[{id:"design",label:"Design",icon:"\u{1F3A8}"},{id:"develop",label:"Develop",icon:"\u{1F4BB}"},{id:"deploy",label:"Deploy",icon:"\u{1F680}"},{id:"monitor",label:"Monitor",icon:"\u{1F4CA}"}];tabItems3=[{id:"profile",label:"Profile",icon:"\u{1F464}"},{id:"settings",label:"Settings",icon:"\u2699\uFE0F"},{id:"security",label:"Security",icon:"\u{1F512}"},{id:"notifications",label:"Notifications",icon:"\u{1F514}"}];tabItems4=[{id:"analytics",label:"Analytics",icon:"\u{1F4C8}"},{id:"reports",label:"Reports",icon:"\u{1F4C4}"},{id:"export",label:"Export",icon:"\u{1F4BE}"},{id:"archive",label:"Archive",icon:"\u{1F4E6}"}];activeTab="overview";breadcrumbItems=[{label:"Home",href:"/"},{label:"Components",href:"/components"},{label:"Showcase",active:!0}];longBreadcrumbItems=[{label:"Home",href:"/"},{label:"Dashboard",href:"/dashboard"},{label:"Settings",href:"/settings"},{label:"Users",href:"/users"},{label:"Profile",href:"/profile"},{label:"Edit",active:!0}];tableColumns=[{key:"id",label:"ID",sortable:!0,width:"80px"},{key:"name",label:"Name",sortable:!0},{key:"email",label:"Email",sortable:!0},{key:"role",label:"Role",sortable:!0},{key:"status",label:"Status"}];tableData=[{id:1,name:"John Doe",email:"john@example.com",role:"Admin",status:"Active"},{id:2,name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"Active"},{id:3,name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"Inactive"},{id:4,name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"Active"},{id:5,name:"Charlie Davis",email:"charlie@example.com",role:"Admin",status:"Active"}];tablePagination={page:1,pageSize:5,total:5};colors=["primary","secondary","accent","success","warning","danger","info","neutral"];buttonVariants=["solid","outline","ghost","soft","link"];sizes=["xs","sm","md","lg","xl"];openModal(c="md"){this.modalSize=c,this.isModalOpen.set(!0)}closeModal(){this.isModalOpen.set(!1)}showToastNotification(c){this.toastColor=c,this.showToast.set(!0)}hideToast(){this.showToast.set(!1)}onTabChange(c){this.activeTab=String(c)}onTableSort(c){console.log("Sort:",c)}onTableSelectionChange(c){console.log("Selection:",c)}simulateLoading(){this.isLoading=!0,setTimeout(()=>{this.isLoading=!1},2e3)}onCardClick(){alert("Card clicked! This is an interactive card.")}static \u0275fac=function(l){return new(l||m)};static \u0275cmp=I({type:m,selectors:[["app-showcase"]],decls:1541,vars:104,consts:[[1,"showcase"],[1,"showcase__header"],[1,"showcase__header-row"],[1,"showcase__title"],[1,"showcase__subtitle"],[1,"showcase__description"],[1,"showcase__section"],[1,"section-title"],[1,"component-description"],[1,"component-api"],[1,"api-table"],[1,"demo-group"],[1,"demo-with-code"],[1,"demo-preview"],["separator","chevron",3,"items"],[1,"code-block"],["separator","slash",3,"items"],["separator","arrow",3,"items"],["separator","dot",3,"items"],[1,"demo-item"],["variant","line",3,"tabChange","tabs","activeTab"],[1,"code-block","code-block--inline"],["variant","enclosed",3,"tabChange","tabs","activeTab"],["variant","pills",3,"tabChange","tabs","activeTab"],["variant","soft",3,"tabChange","tabs","activeTab"],["label","Buttons"],[1,"demo-row"],["color","primary",3,"variant"],["variant","solid",3,"color"],[1,"demo-row","demo-row--align-center"],["variant","solid","color","primary",3,"size"],["variant","solid","color","primary"],["variant","solid","color","primary",3,"disabled"],["variant","solid","color","primary",3,"loading"],[2,"margin-top","1.5rem"],["variant","outline","color","secondary","tooltipPosition","top",3,"uiTooltip"],["variant","soft","color","accent","tooltipPosition","bottom",3,"uiTooltip"],["variant","ghost","color","info","tooltipPosition","left",3,"uiTooltip"],["variant","solid","color","success","tooltipPosition","right",3,"uiTooltip"],[1,"component-hint"],["variant","outline","color","primary"],["color","primary","variant","solid","ariaLabel","Home","tooltip","Solid"],["color","secondary","variant","outline","ariaLabel","Settings","tooltip","Outline"],["color","danger","variant","ghost","ariaLabel","Delete","tooltip","Ghost"],["color","accent","variant","soft","ariaLabel","Edit","tooltip","Soft"],["color","primary","size","xs","ariaLabel","Extra Small","tooltip","XS"],["color","primary","size","sm","ariaLabel","Small","tooltip","SM"],["color","primary","size","md","ariaLabel","Medium","tooltip","MD"],["color","primary","size","lg","ariaLabel","Large","tooltip","LG"],["color","primary","size","xl","ariaLabel","Extra Large","tooltip","XL"],["color","primary","ariaLabel","Normal","tooltip","Normal"],["color","primary","ariaLabel","Disabled","tooltip","Disabled",3,"disabled"],["color","primary","ariaLabel","Loading","tooltip","Loading",3,"loading"],["color","success","ariaLabel","Square","tooltip","Square (not rounded)",3,"rounded"],[3,"color","ariaLabel","tooltip"],["label","Badges"],["variant","subtle","color","primary"],["variant","dot","color","primary"],["variant","solid","color","accent",3,"size"],["variant","outline",3,"color"],["variant","subtle",3,"color"],["label","Forms"],[1,"demo-grid"],["label","Outlined Input","placeholder","Enter text...","variant","outlined",3,"ngModelChange","ngModel"],["label","Filled Input","placeholder","Enter text...","variant","filled"],["label","Underlined Input","placeholder","Enter text...","variant","underlined"],["label","Extra Small","placeholder","XS size...","size","xs"],["label","Small","placeholder","SM size...","size","sm"],["label","Medium (Default)","placeholder","MD size...","size","md"],["label","Large","placeholder","LG size...","size","lg"],["label","Extra Large","placeholder","XL size...","size","xl"],["label","Valid Input","placeholder","Valid state","validationState","valid","helperText","This field is valid!"],["label","Invalid Input","placeholder","Invalid state","validationState","invalid","errorMessage","This field has an error"],["label","Disabled Input","placeholder","Disabled",3,"disabled"],["label","Password","type","password","placeholder","Enter password...",3,"ngModelChange","ngModel"],["label","Clearable Input","placeholder","Type to clear...",3,"clearable"],["label","With Prefix/Suffix","placeholder","0.00",3,"prefix","suffix"],["slot","prefix"],["slot","suffix"],["label","Description","placeholder","Enter description...",3,"ngModelChange","ngModel","rows","showCharacterCount","maxlength"],["label","Framework","placeholder","Select a framework...",3,"ngModelChange","options","ngModel","searchable","clearable"],["label","Accept terms and conditions","color","primary",3,"ngModelChange","ngModel"],["label","Indeterminate state","color","accent",3,"indeterminate"],["label","Disabled checkbox",3,"disabled"],[2,"margin-top","1rem"],["label","Primary","color","primary",3,"ngModelChange","ngModel"],["label","Secondary","color","secondary",3,"ngModelChange","ngModel"],["label","Accent","color","accent",3,"ngModelChange","ngModel"],["label","Success","color","success",3,"ngModelChange","ngModel"],["label","Warning","color","warning",3,"ngModelChange","ngModel"],["label","Danger","color","danger",3,"ngModelChange","ngModel"],["label","Enable notifications","color","success",3,"ngModelChange","ngModel"],["label","Dark mode","color","primary",3,"showIcons"],["label","Disabled toggle",3,"disabled"],[1,"demo-row",2,"flex-wrap","wrap","gap","1rem"],["label","Option 1","name","demo-radio","value","option1","color","primary",3,"ngModelChange","ngModel"],["label","Option 2","name","demo-radio","value","option2","color","primary",3,"ngModelChange","ngModel"],["label","Option 3 (disabled)","name","demo-radio","value","option3",3,"disabled"],["label","Cards"],[1,"demo-grid","demo-grid--cards"],["title","Elevated Card","subtitle","Floating with shadow","variant","elevated"],["title","Outlined Card","subtitle","Bordered container","variant","outlined"],["title","Filled Card","subtitle","Subtle background","variant","filled"],["title","Clickable Card","subtitle","Interactive - Click me!","variant","elevated",3,"cardClick","clickable"],[1,"code-block",2,"margin-top","1rem"],["title","Small Card","variant","outlined","size","sm"],["title","Medium Card (Default)","variant","outlined","size","md"],["title","Large Card","variant","outlined","size","lg"],["title","Hoverable Card","subtitle","Lift on hover","variant","elevated",3,"hoverable"],["title","Non-Hoverable","subtitle","Static card","variant","elevated",3,"hoverable"],[1,"demo-grid","demo-grid--cards",2,"background","var(--surface-sunken)","padding","1rem","border-radius","var(--radius-lg)"],["title","Glass Card","subtitle","Frosted glass effect","variant","glass"],[2,"margin-top","2rem"],[1,"demo-grid","demo-grid--stats"],["label","Total Users","trendDirection","up","description","vs last month","color","primary",3,"value","showTrend","trendValue"],["label","Revenue","trendDirection","down","description","vs last week","color","success","format","currency",3,"value","showTrend","trendValue"],["label","Active Sessions","color","accent",3,"value","showProgress","progress"],["label","Completion Rate","value","89%","trendDirection","up","color","info",3,"showTrend","trendValue"],["trendDirection","up",3,"label","value","color","showTrend","trendValue"],["label","Feedback"],[1,"demo-preview","demo-preview--vertical"],["color","info","variant","soft","title","Information"],["color","success","variant","soft","title","Success!"],["color","warning","variant","soft","title","Warning"],["color","danger","variant","soft","title","Error"],["color","info","variant","filled","title","Information"],["color","success","variant","filled","title","Success!"],["color","warning","variant","filled","title","Warning"],["color","danger","variant","filled","title","Critical Error"],["color","info","variant","outlined","title","Note"],["color","success","variant","outlined","title","Completed"],["color","warning","variant","outlined","title","Caution"],["color","danger","variant","outlined","title","Alert"],["color","info","variant","accent","title","Tip"],["color","success","variant","accent","title","Done"],["color","warning","variant","accent","title","Reminder"],["color","danger","variant","accent","title","Urgent",3,"dismissible"],["color","primary","variant","soft","title","Notification",3,"dismissible"],["variant","solid","color","primary",3,"click"],["variant","solid","color","secondary",3,"click"],["variant","solid","color","accent",3,"click"],["variant","soft","color","success",3,"click"],["variant","soft","color","danger",3,"click"],["variant","soft","color","warning",3,"click"],["variant","soft","color","info",3,"click"],["label","Data Display"],["variant","striped",3,"sortChange","selectionChange","columns","data","selectable","showPagination","pagination"],["variant","bordered",3,"columns","data","rowClickable"],["variant","default","size","sm",3,"columns","data","compact"],["variant","striped",3,"columns","data","loading"],["variant","bordered","emptyMessage","No records found. Try adjusting your filters.",3,"columns","data"],["label","Display Components"],["src","https://i.pravatar.cc/150?img=1","alt","User 1","size","xs"],["src","https://i.pravatar.cc/150?img=2","alt","User 2","size","sm"],["src","https://i.pravatar.cc/150?img=3","alt","User 3","size","md"],["src","https://i.pravatar.cc/150?img=4","alt","User 4","size","lg"],["src","https://i.pravatar.cc/150?img=5","alt","User 5","size","xl"],["initials","CR","color","primary","shape","circle","size","lg"],["initials","RD","color","secondary","shape","rounded","size","lg"],["initials","SQ","color","accent","shape","square","size","lg"],["size","md",3,"initials","color"],["src","https://i.pravatar.cc/150?img=10","size","lg","badgeColor","success",3,"showBadge"],["initials","JD","size","lg","color","primary","badgeColor","warning",3,"showBadge"],["initials","OF","size","lg","color","neutral","badgeColor","danger",3,"showBadge"],["src","https://i.pravatar.cc/150?img=15","size","lg","badgeColor","info",3,"showBadge"],["href","/"],["href","/","color","primary"],["href","/","color","secondary"],["href","/","color","accent","underline","always"],["href","https://google.com",3,"external"],[1,"demo-row",2,"margin-top","0.5rem"],["href","/","color","success"],["href","/","color","warning"],["href","/","color","danger"],["href","/","color","info"],["href","/","underline","none"],["variant","dashed"],["variant","dotted"],["label","Section Start","labelPosition","left"],["label","OR","labelPosition","center"],["label","Section End","labelPosition","right"],["label","Loaders"],[2,"text-align","center"],["size","xs","color","primary"],[2,"font-size","0.75rem","margin-top","0.25rem"],["size","sm","color","primary"],["size","md","color","primary"],["size","lg","color","primary"],["size","xl","color","primary"],[1,"component-api",2,"margin-top","2rem"],[1,"demo-row","demo-row--align-center",2,"gap","2rem"],["variant","circular","width","64px","height","64px"],[2,"font-size","0.75rem","margin-top","0.5rem"],["variant","rectangular","width","100px","height","64px"],["variant","text","width","150px","height","20px"],[1,"skeleton-demo"],[1,"skeleton-row"],["variant","circular","width","48px","height","48px"],[1,"skeleton-content"],["variant","text","width","150px"],["variant","text","width","100px","height","12px"],["variant","rectangular","width","100%","height","120px"],["variant","text","width","100%"],["variant","text","width","80%"],["variant","text","width","60%"],[2,"display","flex","flex-direction","column","gap","1rem","max-width","400px"],[2,"display","flex","gap","1rem","align-items","center"],["variant","solid","color","primary",3,"click","loading"],["variant","outline","color","secondary",3,"click","loading"],["title","Example Modal",3,"isOpen","size","showCloseButton"],["position","top-right",3,"message","color","title","duration","showProgress"],[1,"showcase__footer"],["size","md",3,"color"],["variant","circular","width","40px","height","40px"],[2,"flex","1","display","flex","flex-direction","column","gap","0.5rem"],["variant","text","width","60%","height","12px"],["title","Example Modal",3,"closed","isOpen","size","showCloseButton"],[2,"margin-top","1.5rem","display","flex","gap","0.5rem","justify-content","flex-end"],["variant","ghost","color","neutral",3,"click"],["position","top-right",3,"dismissed","message","color","title","duration","showProgress"]],template:function(l,n){l&1&&(e(0,"div",0)(1,"header",1)(2,"div",2)(3,"h1",3),i(4,"\u{1F3A8} UI Component Library"),t(),d(5,"ui-theme-toggle"),t(),e(6,"p",4),i(7,"A comprehensive collection of customizable Angular components"),t(),e(8,"p",5),i(9,"Each component below includes live examples and usage code. Copy the code snippets to use in your own templates."),t()(),e(10,"section",6)(11,"h2",7),i(12,"Breadcrumbs"),t(),e(13,"p",8),i(14,"Breadcrumbs help users navigate hierarchical content by showing their current location within the site structure."),t(),e(15,"div",9)(16,"h4"),i(17,"API Reference"),t(),e(18,"table",10)(19,"thead")(20,"tr")(21,"th"),i(22,"Input"),t(),e(23,"th"),i(24,"Type"),t(),e(25,"th"),i(26,"Default"),t(),e(27,"th"),i(28,"Description"),t()()(),e(29,"tbody")(30,"tr")(31,"td")(32,"code"),i(33,"items"),t()(),e(34,"td")(35,"code"),i(36,"BreadcrumbItem[]"),t()(),e(37,"td"),i(38,"-"),t(),e(39,"td"),i(40,"Array of breadcrumb items with label and optional href"),t()(),e(41,"tr")(42,"td")(43,"code"),i(44,"separator"),t()(),e(45,"td")(46,"code"),i(47,"'chevron' | 'slash' | 'arrow' | 'dot'"),t()(),e(48,"td")(49,"code"),i(50,"'chevron'"),t()(),e(51,"td"),i(52,"Separator style between items"),t()()()()(),e(53,"div",11)(54,"h3"),i(55,"Chevron Separator (Default)"),t(),e(56,"div",12)(57,"div",13),d(58,"ui-breadcrumb",14),t(),e(59,"div",15)(60,"pre")(61,"code"),i(62,`<ui-breadcrumb
  [items]="breadcrumbItems"
  separator="chevron">
</ui-breadcrumb>

// In component.ts:
breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Category' }
];`),t()()()()(),e(63,"div",11)(64,"h3"),i(65,"Slash Separator"),t(),e(66,"div",12)(67,"div",13),d(68,"ui-breadcrumb",16),t(),e(69,"div",15)(70,"pre")(71,"code"),i(72,`<ui-breadcrumb
  [items]="breadcrumbItems"
  separator="slash">
</ui-breadcrumb>`),t()()()()(),e(73,"div",11)(74,"h3"),i(75,"Arrow Separator"),t(),e(76,"div",12)(77,"div",13),d(78,"ui-breadcrumb",17),t(),e(79,"div",15)(80,"pre")(81,"code"),i(82,`<ui-breadcrumb
  [items]="breadcrumbItems"
  separator="arrow">
</ui-breadcrumb>`),t()()()()(),e(83,"div",11)(84,"h3"),i(85,"Dot Separator"),t(),e(86,"div",12)(87,"div",13),d(88,"ui-breadcrumb",18),t(),e(89,"div",15)(90,"pre")(91,"code"),i(92,`<ui-breadcrumb
  [items]="breadcrumbItems"
  separator="dot">
</ui-breadcrumb>`),t()()()()(),e(93,"div",11)(94,"h3"),i(95,"Longer Breadcrumb Trail"),t(),e(96,"div",12)(97,"div",13),d(98,"ui-breadcrumb",14),t(),e(99,"div",15)(100,"pre")(101,"code"),i(102,`<ui-breadcrumb
  [items]="longBreadcrumbItems"
  separator="chevron">
</ui-breadcrumb>

// For longer trails:
longBreadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile', href: '/profile' },
  { label: 'Edit' }
];`),t()()()()()(),d(103,"ui-divider"),e(104,"section",6)(105,"h2",7),i(106,"Navigation - Tabs"),t(),e(107,"p",8),i(108,"Tabs organize content into separate views where only one view is visible at a time. Use tabs to reduce clutter and group related content."),t(),e(109,"div",9)(110,"h4"),i(111,"API Reference"),t(),e(112,"table",10)(113,"thead")(114,"tr")(115,"th"),i(116,"Input"),t(),e(117,"th"),i(118,"Type"),t(),e(119,"th"),i(120,"Default"),t(),e(121,"th"),i(122,"Description"),t()()(),e(123,"tbody")(124,"tr")(125,"td")(126,"code"),i(127,"tabs"),t()(),e(128,"td")(129,"code"),i(130,"TabItem[]"),t()(),e(131,"td"),i(132,"-"),t(),e(133,"td"),i(134,"Array of tab items with id, label, and optional icon/disabled"),t()(),e(135,"tr")(136,"td")(137,"code"),i(138,"activeTab"),t()(),e(139,"td")(140,"code"),i(141,"string"),t()(),e(142,"td"),i(143,"-"),t(),e(144,"td"),i(145,"ID of the currently active tab"),t()(),e(146,"tr")(147,"td")(148,"code"),i(149,"variant"),t()(),e(150,"td")(151,"code"),i(152,"'line' | 'enclosed' | 'pills' | 'soft'"),t()(),e(153,"td")(154,"code"),i(155,"'line'"),t()(),e(156,"td"),i(157,"Visual style variant"),t()()()(),e(158,"table",10)(159,"thead")(160,"tr")(161,"th"),i(162,"Output"),t(),e(163,"th"),i(164,"Type"),t(),e(165,"th"),i(166,"Description"),t()()(),e(167,"tbody")(168,"tr")(169,"td")(170,"code"),i(171,"tabChange"),t()(),e(172,"td")(173,"code"),i(174,"EventEmitter<string>"),t()(),e(175,"td"),i(176,"Emits the tab ID when a tab is selected"),t()()()()(),e(177,"div",11)(178,"div",19)(179,"h4"),i(180,"Line Tabs"),t(),e(181,"ui-tabs",20),b("tabChange",function(o){return n.onTabChange(o)}),t(),e(182,"div",21)(183,"pre")(184,"code"),i(185,`<ui-tabs
  [tabs]="tabItems"
  [activeTab]="activeTab"
  variant="line"
  (tabChange)="onTabChange($event)">
</ui-tabs>`),t()()()(),e(186,"div",19)(187,"h4"),i(188,"Enclosed Tabs"),t(),e(189,"ui-tabs",22),b("tabChange",function(o){return n.onTabChange(o)}),t(),e(190,"div",21)(191,"pre")(192,"code"),i(193,`<ui-tabs
  [tabs]="tabItems2"
  [activeTab]="activeTab"
  variant="enclosed"
  (tabChange)="onTabChange($event)">
</ui-tabs>`),t()()()(),e(194,"div",19)(195,"h4"),i(196,"Pills Tabs"),t(),e(197,"ui-tabs",23),b("tabChange",function(o){return n.onTabChange(o)}),t(),e(198,"div",21)(199,"pre")(200,"code"),i(201,`<ui-tabs
  [tabs]="tabItems3"
  [activeTab]="activeTab"
  variant="pills"
  (tabChange)="onTabChange($event)">
</ui-tabs>`),t()()()(),e(202,"div",19)(203,"h4"),i(204,"Soft Tabs"),t(),e(205,"ui-tabs",24),b("tabChange",function(o){return n.onTabChange(o)}),t(),e(206,"div",21)(207,"pre")(208,"code"),i(209,`<ui-tabs
  [tabs]="tabItems4"
  [activeTab]="activeTab"
  variant="soft"
  (tabChange)="onTabChange($event)">
</ui-tabs>

// TabItem interface:
interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}`),t()()()()()(),d(210,"ui-divider",25),e(211,"section",6)(212,"h2",7),i(213,"Buttons"),t(),e(214,"p",8),i(215,"Buttons trigger actions and are essential interactive elements. They come in multiple variants, colors, and sizes to suit different UI needs."),t(),e(216,"div",9)(217,"h4"),i(218,"API Reference"),t(),e(219,"table",10)(220,"thead")(221,"tr")(222,"th"),i(223,"Input"),t(),e(224,"th"),i(225,"Type"),t(),e(226,"th"),i(227,"Default"),t(),e(228,"th"),i(229,"Description"),t()()(),e(230,"tbody")(231,"tr")(232,"td")(233,"code"),i(234,"variant"),t()(),e(235,"td")(236,"code"),i(237,"'solid' | 'outline' | 'ghost' | 'soft' | 'link'"),t()(),e(238,"td")(239,"code"),i(240,"'solid'"),t()(),e(241,"td"),i(242,"Visual style variant"),t()(),e(243,"tr")(244,"td")(245,"code"),i(246,"color"),t()(),e(247,"td")(248,"code"),i(249,"'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'"),t()(),e(250,"td")(251,"code"),i(252,"'primary'"),t()(),e(253,"td"),i(254,"Color scheme"),t()(),e(255,"tr")(256,"td")(257,"code"),i(258,"size"),t()(),e(259,"td")(260,"code"),i(261,"'xs' | 'sm' | 'md' | 'lg' | 'xl'"),t()(),e(262,"td")(263,"code"),i(264,"'md'"),t()(),e(265,"td"),i(266,"Button size"),t()(),e(267,"tr")(268,"td")(269,"code"),i(270,"disabled"),t()(),e(271,"td")(272,"code"),i(273,"boolean"),t()(),e(274,"td")(275,"code"),i(276,"false"),t()(),e(277,"td"),i(278,"Disables the button"),t()(),e(279,"tr")(280,"td")(281,"code"),i(282,"loading"),t()(),e(283,"td")(284,"code"),i(285,"boolean"),t()(),e(286,"td")(287,"code"),i(288,"false"),t()(),e(289,"td"),i(290,"Shows loading spinner"),t()()()()(),e(291,"div",11)(292,"h3"),i(293,"Button Variants"),t(),e(294,"div",12)(295,"div",13)(296,"div",26),v(297,be,3,4,"ui-button",27,h),t()(),e(299,"div",15)(300,"pre")(301,"code"),i(302,`<!-- Solid (default) -->
<ui-button variant="solid" color="primary">Solid</ui-button>

<!-- Outline -->
<ui-button variant="outline" color="primary">Outline</ui-button>

<!-- Ghost -->
<ui-button variant="ghost" color="primary">Ghost</ui-button>

<!-- Soft -->
<ui-button variant="soft" color="primary">Soft</ui-button>

<!-- Link -->
<ui-button variant="link" color="primary">Link</ui-button>`),t()()()()(),e(303,"div",11)(304,"h3"),i(305,"Button Colors"),t(),e(306,"div",12)(307,"div",13)(308,"div",26),v(309,he,3,4,"ui-button",28,h),t()(),e(311,"div",15)(312,"pre")(313,"code"),i(314,`<ui-button color="primary">Primary</ui-button>
<ui-button color="secondary">Secondary</ui-button>
<ui-button color="accent">Accent</ui-button>
<ui-button color="success">Success</ui-button>
<ui-button color="warning">Warning</ui-button>
<ui-button color="danger">Danger</ui-button>
<ui-button color="info">Info</ui-button>
<ui-button color="neutral">Neutral</ui-button>`),t()()()()(),e(315,"div",11)(316,"h3"),i(317,"Button Sizes"),t(),e(318,"div",12)(319,"div",13)(320,"div",29),v(321,ve,3,4,"ui-button",30,h),t()(),e(323,"div",15)(324,"pre")(325,"code"),i(326,`<ui-button size="xs">XS</ui-button>
<ui-button size="sm">SM</ui-button>
<ui-button size="md">MD</ui-button>  <!-- default -->
<ui-button size="lg">LG</ui-button>
<ui-button size="xl">XL</ui-button>`),t()()()()(),e(327,"div",11)(328,"h3"),i(329,"Button States"),t(),e(330,"div",12)(331,"div",13)(332,"div",26)(333,"ui-button",31),i(334,"Normal"),t(),e(335,"ui-button",32),i(336,"Disabled"),t(),e(337,"ui-button",33),i(338,"Loading"),t()()(),e(339,"div",15)(340,"pre")(341,"code"),i(342,`<!-- Normal state -->
<ui-button>Normal</ui-button>

<!-- Disabled state -->
<ui-button [disabled]="true">Disabled</ui-button>

<!-- Loading state -->
<ui-button [loading]="true">Loading</ui-button>`),t()()()(),e(343,"h4",34),i(344,"Buttons with Tooltips"),t(),e(345,"div",12)(346,"div",13)(347,"div",26)(348,"ui-button",35),i(349,"Hover for Tooltip \u2B06"),t(),e(350,"ui-button",36),i(351,"Tooltip Below \u2B07"),t(),e(352,"ui-button",37),i(353,"\u2190 Tooltip Left"),t(),e(354,"ui-button",38),i(355,"Tooltip Right \u2192"),t()()(),e(356,"div",15)(357,"pre")(358,"code"),i(359,`<ui-button
  [uiTooltip]="'Helpful info'"
  tooltipPosition="top">
  Hover for Tooltip
</ui-button>

<!-- Positions: 'top' | 'bottom' | 'left' | 'right' -->`),t()()()()(),e(360,"div",11)(361,"h3"),i(362,"Button Group"),t(),e(363,"p",39),i(364,"Use button groups to combine related buttons into a single visual unit."),t(),e(365,"div",12)(366,"div",13)(367,"div",26)(368,"ui-button-group")(369,"ui-button",40),i(370,"Left"),t(),e(371,"ui-button",40),i(372,"Center"),t(),e(373,"ui-button",40),i(374,"Right"),t()()()(),e(375,"div",15)(376,"pre")(377,"code"),i(378,`<ui-button-group>
  <ui-button variant="outline" color="primary">Left</ui-button>
  <ui-button variant="outline" color="primary">Center</ui-button>
  <ui-button variant="outline" color="primary">Right</ui-button>
</ui-button-group>`),t()()()()(),e(379,"div",11)(380,"h3"),i(381,"Icon Buttons - Variants"),t(),e(382,"p",39),i(383,"Icon buttons are compact buttons that contain only an icon. Perfect for toolbars and action menus."),t(),e(384,"div",12)(385,"div",13)(386,"div",29)(387,"ui-icon-button",41)(388,"mat-icon"),i(389,"home"),t()(),e(390,"ui-icon-button",42)(391,"mat-icon"),i(392,"settings"),t()(),e(393,"ui-icon-button",43)(394,"mat-icon"),i(395,"delete"),t()(),e(396,"ui-icon-button",44)(397,"mat-icon"),i(398,"edit"),t()()()(),e(399,"div",15)(400,"pre")(401,"code"),i(402,`<ui-icon-button
  color="primary"
  variant="solid"
  ariaLabel="Home"
  tooltip="Solid">
  <mat-icon>home</mat-icon>
</ui-icon-button>

<ui-icon-button
  color="secondary"
  variant="outline"
  ariaLabel="Settings">
  <mat-icon>settings</mat-icon>
</ui-icon-button>`),t()()()()(),e(403,"div",11)(404,"h3"),i(405,"Icon Buttons - Sizes"),t(),e(406,"div",12)(407,"div",13)(408,"div",29)(409,"ui-icon-button",45)(410,"mat-icon"),i(411,"star"),t()(),e(412,"ui-icon-button",46)(413,"mat-icon"),i(414,"star"),t()(),e(415,"ui-icon-button",47)(416,"mat-icon"),i(417,"star"),t()(),e(418,"ui-icon-button",48)(419,"mat-icon"),i(420,"star"),t()(),e(421,"ui-icon-button",49)(422,"mat-icon"),i(423,"star"),t()()()(),e(424,"div",15)(425,"pre")(426,"code"),i(427,`<ui-icon-button size="xs">...</ui-icon-button>
<ui-icon-button size="sm">...</ui-icon-button>
<ui-icon-button size="md">...</ui-icon-button>
<ui-icon-button size="lg">...</ui-icon-button>
<ui-icon-button size="xl">...</ui-icon-button>`),t()()()()(),e(428,"div",11)(429,"h3"),i(430,"Icon Buttons - States"),t(),e(431,"div",12)(432,"div",13)(433,"div",29)(434,"ui-icon-button",50)(435,"mat-icon"),i(436,"check_circle"),t()(),e(437,"ui-icon-button",51)(438,"mat-icon"),i(439,"block"),t()(),e(440,"ui-icon-button",52)(441,"mat-icon"),i(442,"sync"),t()(),e(443,"ui-icon-button",53)(444,"mat-icon"),i(445,"crop_square"),t()()()(),e(446,"div",15)(447,"pre")(448,"code"),i(449,`<!-- Normal -->
<ui-icon-button ariaLabel="Check">
  <mat-icon>check_circle</mat-icon>
</ui-icon-button>

<!-- Disabled -->
<ui-icon-button [disabled]="true">...</ui-icon-button>

<!-- Loading -->
<ui-icon-button [loading]="true">...</ui-icon-button>

<!-- Square (not rounded) -->
<ui-icon-button [rounded]="false">...</ui-icon-button>`),t()()()()(),e(450,"div",11)(451,"h3"),i(452,"Icon Buttons - All Colors"),t(),e(453,"div",12)(454,"div",13)(455,"div",29),v(456,Se,4,5,"ui-icon-button",54,h),t()(),e(458,"div",15)(459,"pre")(460,"code"),i(461,`<ui-icon-button color="primary">...</ui-icon-button>
<ui-icon-button color="secondary">...</ui-icon-button>
<ui-icon-button color="accent">...</ui-icon-button>
<ui-icon-button color="success">...</ui-icon-button>
<ui-icon-button color="warning">...</ui-icon-button>
<ui-icon-button color="danger">...</ui-icon-button>
<ui-icon-button color="info">...</ui-icon-button>
<ui-icon-button color="neutral">...</ui-icon-button>`),t()()()()()(),d(462,"ui-divider",55),e(463,"section",6)(464,"h2",7),i(465,"Badges"),t(),e(466,"p",8),i(467,"Badges are small status indicators that highlight key information like counts, statuses, or labels."),t(),e(468,"div",9)(469,"h4"),i(470,"API Reference"),t(),e(471,"table",10)(472,"thead")(473,"tr")(474,"th"),i(475,"Input"),t(),e(476,"th"),i(477,"Type"),t(),e(478,"th"),i(479,"Default"),t(),e(480,"th"),i(481,"Description"),t()()(),e(482,"tbody")(483,"tr")(484,"td")(485,"code"),i(486,"variant"),t()(),e(487,"td")(488,"code"),i(489,"'solid' | 'outline' | 'subtle' | 'dot'"),t()(),e(490,"td")(491,"code"),i(492,"'solid'"),t()(),e(493,"td"),i(494,"Visual style variant"),t()(),e(495,"tr")(496,"td")(497,"code"),i(498,"color"),t()(),e(499,"td")(500,"code"),i(501,"'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'"),t()(),e(502,"td")(503,"code"),i(504,"'primary'"),t()(),e(505,"td"),i(506,"Color scheme"),t()(),e(507,"tr")(508,"td")(509,"code"),i(510,"size"),t()(),e(511,"td")(512,"code"),i(513,"'xs' | 'sm' | 'md' | 'lg' | 'xl'"),t()(),e(514,"td")(515,"code"),i(516,"'md'"),t()(),e(517,"td"),i(518,"Badge size"),t()()()()(),e(519,"div",11)(520,"h3"),i(521,"Badge Variants"),t(),e(522,"div",12)(523,"div",13)(524,"div",26)(525,"ui-badge",31),i(526,"Solid"),t(),e(527,"ui-badge",40),i(528,"Outline"),t(),e(529,"ui-badge",56),i(530,"Subtle"),t(),e(531,"ui-badge",57),i(532,"With Dot"),t()()(),e(533,"div",15)(534,"pre")(535,"code"),i(536,`<ui-badge variant="solid" color="primary">Solid</ui-badge>
<ui-badge variant="outline" color="primary">Outline</ui-badge>
<ui-badge variant="subtle" color="primary">Subtle</ui-badge>
<ui-badge variant="dot" color="primary">With Dot</ui-badge>`),t()()()()(),e(537,"div",11)(538,"h3"),i(539,"Badge Colors"),t(),e(540,"div",12)(541,"div",13)(542,"div",26),v(543,xe,3,4,"ui-badge",28,h),t()(),e(545,"div",15)(546,"pre")(547,"code"),i(548,`<ui-badge color="primary">Primary</ui-badge>
<ui-badge color="secondary">Secondary</ui-badge>
<ui-badge color="accent">Accent</ui-badge>
<ui-badge color="success">Success</ui-badge>
<ui-badge color="warning">Warning</ui-badge>
<ui-badge color="danger">Danger</ui-badge>
<ui-badge color="info">Info</ui-badge>
<ui-badge color="neutral">Neutral</ui-badge>`),t()()()()(),e(549,"div",11)(550,"h3"),i(551,"Badge Sizes"),t(),e(552,"div",12)(553,"div",13)(554,"div",29),v(555,Ee,3,4,"ui-badge",58,h),t()(),e(557,"div",15)(558,"pre")(559,"code"),i(560,`<ui-badge size="xs">XS</ui-badge>
<ui-badge size="sm">SM</ui-badge>
<ui-badge size="md">MD</ui-badge>
<ui-badge size="lg">LG</ui-badge>
<ui-badge size="xl">XL</ui-badge>`),t()()()()(),e(561,"div",11)(562,"h3"),i(563,"Badge with Outline Variants"),t(),e(564,"div",12)(565,"div",13)(566,"div",26),v(567,fe,3,4,"ui-badge",59,h),t()(),e(569,"div",15)(570,"pre")(571,"code"),i(572,`<ui-badge variant="outline" color="primary">Primary</ui-badge>
<ui-badge variant="outline" color="success">Success</ui-badge>
<ui-badge variant="outline" color="danger">Danger</ui-badge>`),t()()()()(),e(573,"div",11)(574,"h3"),i(575,"Subtle Badges"),t(),e(576,"div",12)(577,"div",13)(578,"div",26),v(579,Ce,3,4,"ui-badge",60,h),t()(),e(581,"div",15)(582,"pre")(583,"code"),i(584,`<ui-badge variant="subtle" color="primary">Primary</ui-badge>
<ui-badge variant="subtle" color="success">Success</ui-badge>
<ui-badge variant="subtle" color="warning">Warning</ui-badge>`),t()()()()()(),d(585,"ui-divider",61),e(586,"section",6)(587,"h2",7),i(588,"Form Components"),t(),e(589,"p",8),i(590,"Form components enable user input and data collection. All form components support Angular's ngModel for two-way data binding."),t(),e(591,"div",62)(592,"div",11)(593,"h3"),i(594,"Input Variants"),t(),e(595,"ui-input",63),g("ngModelChange",function(o){return p(n.inputValue,o)||(n.inputValue=o),o}),t(),d(596,"ui-input",64)(597,"ui-input",65),e(598,"div",21)(599,"pre")(600,"code"),i(601,`<ui-input
  label="Outlined Input"
  placeholder="Enter text..."
  variant="outlined"
  [(ngModel)]="inputValue">
</ui-input>

<ui-input variant="filled"></ui-input>
<ui-input variant="underlined"></ui-input>`),t()()()(),e(602,"div",11)(603,"h3"),i(604,"Input Sizes"),t(),d(605,"ui-input",66)(606,"ui-input",67)(607,"ui-input",68)(608,"ui-input",69)(609,"ui-input",70),e(610,"div",21)(611,"pre")(612,"code"),i(613,`<ui-input size="xs"></ui-input>
<ui-input size="sm"></ui-input>
<ui-input size="md"></ui-input>
<ui-input size="lg"></ui-input>
<ui-input size="xl"></ui-input>`),t()()()(),e(614,"div",11)(615,"h3"),i(616,"Input States"),t(),d(617,"ui-input",71)(618,"ui-input",72)(619,"ui-input",73),e(620,"div",21)(621,"pre")(622,"code"),i(623,`<ui-input
  validationState="valid"
  helperText="This field is valid!">
</ui-input>

<ui-input
  validationState="invalid"
  errorMessage="This field has an error">
</ui-input>

<ui-input [disabled]="true"></ui-input>`),t()()()(),e(624,"div",11)(625,"h3"),i(626,"Special Inputs"),t(),e(627,"ui-input",74),g("ngModelChange",function(o){return p(n.passwordValue,o)||(n.passwordValue=o),o}),t(),d(628,"ui-input",75),e(629,"ui-input",76)(630,"span",77),i(631,"$"),t(),e(632,"span",78),i(633,"USD"),t()(),e(634,"div",21)(635,"pre")(636,"code"),i(637,`<ui-input type="password"></ui-input>

<ui-input [clearable]="true"></ui-input>

<ui-input [prefix]="true" [suffix]="true">
  <span slot="prefix">$</span>
  <span slot="suffix">USD</span>
</ui-input>`),t()()()(),e(638,"div",11)(639,"h3"),i(640,"Textarea"),t(),e(641,"ui-textarea",79),g("ngModelChange",function(o){return p(n.textareaValue,o)||(n.textareaValue=o),o}),t(),e(642,"div",21)(643,"pre")(644,"code"),i(645,`<ui-textarea
  label="Description"
  placeholder="Enter description..."
  [(ngModel)]="textareaValue"
  [rows]="4"
  [showCharacterCount]="true"
  [maxlength]="200">
</ui-textarea>`),t()()()(),e(646,"div",11)(647,"h3"),i(648,"Select"),t(),e(649,"ui-select",80),g("ngModelChange",function(o){return p(n.selectedOption,o)||(n.selectedOption=o),o}),t(),e(650,"div",21)(651,"pre")(652,"code"),i(653,`<ui-select
  label="Framework"
  placeholder="Select a framework..."
  [options]="selectOptions"
  [(ngModel)]="selectedOption"
  [searchable]="true"
  [clearable]="true">
</ui-select>

// Options format:
selectOptions = [
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' }
];`),t()()()(),e(654,"div",11)(655,"h3"),i(656,"Checkboxes"),t(),e(657,"ui-checkbox",81),g("ngModelChange",function(o){return p(n.checkboxValue,o)||(n.checkboxValue=o),o}),t(),d(658,"ui-checkbox",82)(659,"ui-checkbox",83),e(660,"h4",84),i(661,"Checkbox Colors"),t(),e(662,"div",26)(663,"ui-checkbox",85),g("ngModelChange",function(o){return p(n.demoCheckboxPrimary,o)||(n.demoCheckboxPrimary=o),o}),t(),e(664,"ui-checkbox",86),g("ngModelChange",function(o){return p(n.demoCheckboxSecondary,o)||(n.demoCheckboxSecondary=o),o}),t(),e(665,"ui-checkbox",87),g("ngModelChange",function(o){return p(n.demoCheckboxAccent,o)||(n.demoCheckboxAccent=o),o}),t(),e(666,"ui-checkbox",88),g("ngModelChange",function(o){return p(n.demoCheckboxSuccess,o)||(n.demoCheckboxSuccess=o),o}),t(),e(667,"ui-checkbox",89),g("ngModelChange",function(o){return p(n.demoCheckboxWarning,o)||(n.demoCheckboxWarning=o),o}),t(),e(668,"ui-checkbox",90),g("ngModelChange",function(o){return p(n.demoCheckboxDanger,o)||(n.demoCheckboxDanger=o),o}),t()(),e(669,"div",21)(670,"pre")(671,"code"),i(672,`<ui-checkbox
  label="Accept terms"
  [(ngModel)]="checkboxValue"
  color="primary">
</ui-checkbox>

<ui-checkbox [indeterminate]="true"></ui-checkbox>
<ui-checkbox [disabled]="true"></ui-checkbox>`),t()()()(),e(673,"div",11)(674,"h3"),i(675,"Toggles"),t(),e(676,"ui-toggle",91),g("ngModelChange",function(o){return p(n.toggleValue,o)||(n.toggleValue=o),o}),t(),d(677,"ui-toggle",92)(678,"ui-toggle",93),e(679,"h4",84),i(680,"Toggle Colors"),t(),e(681,"div",94)(682,"ui-toggle",85),g("ngModelChange",function(o){return p(n.demoTogglePrimary,o)||(n.demoTogglePrimary=o),o}),t(),e(683,"ui-toggle",86),g("ngModelChange",function(o){return p(n.demoToggleSecondary,o)||(n.demoToggleSecondary=o),o}),t(),e(684,"ui-toggle",87),g("ngModelChange",function(o){return p(n.demoToggleAccent,o)||(n.demoToggleAccent=o),o}),t(),e(685,"ui-toggle",88),g("ngModelChange",function(o){return p(n.demoToggleSuccess,o)||(n.demoToggleSuccess=o),o}),t(),e(686,"ui-toggle",89),g("ngModelChange",function(o){return p(n.demoToggleWarning,o)||(n.demoToggleWarning=o),o}),t(),e(687,"ui-toggle",90),g("ngModelChange",function(o){return p(n.demoToggleDanger,o)||(n.demoToggleDanger=o),o}),t()(),e(688,"div",21)(689,"pre")(690,"code"),i(691,`<ui-toggle
  label="Enable notifications"
  [(ngModel)]="toggleValue"
  color="success">
</ui-toggle>

<ui-toggle [showIcons]="true"></ui-toggle>
<ui-toggle [disabled]="true"></ui-toggle>`),t()()()(),e(692,"div",11)(693,"h3"),i(694,"Radio Buttons"),t(),e(695,"ui-radio",95),g("ngModelChange",function(o){return p(n.radioValue,o)||(n.radioValue=o),o}),t(),e(696,"ui-radio",96),g("ngModelChange",function(o){return p(n.radioValue,o)||(n.radioValue=o),o}),t(),d(697,"ui-radio",97),e(698,"div",21)(699,"pre")(700,"code"),i(701,`<ui-radio
  label="Option 1"
  name="demo-radio"
  value="option1"
  [(ngModel)]="radioValue"
  color="primary">
</ui-radio>

<ui-radio
  label="Option 2"
  name="demo-radio"
  value="option2"
  [(ngModel)]="radioValue">
</ui-radio>

<ui-radio [disabled]="true"></ui-radio>`),t()()()()()(),d(702,"ui-divider",98),e(703,"section",6)(704,"h2",7),i(705,"Cards"),t(),e(706,"p",8),i(707,"Cards are flexible containers that group related content and actions. They provide visual separation and hierarchy to your UI."),t(),e(708,"div",9)(709,"h4"),i(710,"API Reference"),t(),e(711,"table",10)(712,"thead")(713,"tr")(714,"th"),i(715,"Input"),t(),e(716,"th"),i(717,"Type"),t(),e(718,"th"),i(719,"Default"),t(),e(720,"th"),i(721,"Description"),t()()(),e(722,"tbody")(723,"tr")(724,"td")(725,"code"),i(726,"variant"),t()(),e(727,"td")(728,"code"),i(729,"'elevated' | 'outlined' | 'filled' | 'glass'"),t()(),e(730,"td")(731,"code"),i(732,"'elevated'"),t()(),e(733,"td"),i(734,"Visual style variant"),t()(),e(735,"tr")(736,"td")(737,"code"),i(738,"size"),t()(),e(739,"td")(740,"code"),i(741,"'sm' | 'md' | 'lg'"),t()(),e(742,"td")(743,"code"),i(744,"'md'"),t()(),e(745,"td"),i(746,"Card padding size"),t()(),e(747,"tr")(748,"td")(749,"code"),i(750,"title"),t()(),e(751,"td")(752,"code"),i(753,"string"),t()(),e(754,"td"),i(755,"-"),t(),e(756,"td"),i(757,"Card header title"),t()(),e(758,"tr")(759,"td")(760,"code"),i(761,"subtitle"),t()(),e(762,"td")(763,"code"),i(764,"string"),t()(),e(765,"td"),i(766,"-"),t(),e(767,"td"),i(768,"Card header subtitle"),t()(),e(769,"tr")(770,"td")(771,"code"),i(772,"clickable"),t()(),e(773,"td")(774,"code"),i(775,"boolean"),t()(),e(776,"td")(777,"code"),i(778,"false"),t()(),e(779,"td"),i(780,"Makes the card interactive"),t()(),e(781,"tr")(782,"td")(783,"code"),i(784,"hoverable"),t()(),e(785,"td")(786,"code"),i(787,"boolean"),t()(),e(788,"td")(789,"code"),i(790,"true"),t()(),e(791,"td"),i(792,"Enables hover lift effect"),t()()()()(),e(793,"div",11)(794,"h3"),i(795,"Card Variants"),t()(),e(796,"div",99)(797,"ui-card",100)(798,"p"),i(799,"This elevated card floats above the surface with a prominent shadow. Hover to see it lift higher!"),t()(),e(800,"ui-card",101)(801,"p"),i(802,"This card uses a visible border instead of shadow. Hover to see the border change color."),t()(),e(803,"ui-card",102)(804,"p"),i(805,"This card has a subtle gray background that distinguishes it from the page surface."),t()(),e(806,"ui-card",103),b("cardClick",function(){return n.onCardClick()}),e(807,"p"),i(808,"This card is fully interactive! Notice the scale effect on hover and the different active state."),t()()(),e(809,"div",104)(810,"pre")(811,"code"),i(812,`<ui-card
  title="Elevated Card"
  subtitle="Floating with shadow"
  variant="elevated">
  <p>Card content goes here...</p>
</ui-card>

<ui-card variant="outlined">...</ui-card>
<ui-card variant="filled">...</ui-card>

<!-- Clickable card -->
<ui-card
  [clickable]="true"
  (cardClick)="onCardClick()">
  ...
</ui-card>`),t()()(),e(813,"div",11)(814,"h3"),i(815,"Card Sizes"),t()(),e(816,"div",99)(817,"ui-card",105)(818,"p"),i(819,"Compact padding for smaller content areas."),t()(),e(820,"ui-card",106)(821,"p"),i(822,"Standard padding for most use cases."),t()(),e(823,"ui-card",107)(824,"p"),i(825,"Extra spacious padding for prominent content."),t()()(),e(826,"div",104)(827,"pre")(828,"code"),i(829,`<ui-card size="sm">...</ui-card>
<ui-card size="md">...</ui-card>  <!-- default -->
<ui-card size="lg">...</ui-card>`),t()()(),e(830,"div",11)(831,"h3"),i(832,"Card with Hoverable Effect"),t()(),e(833,"div",99)(834,"ui-card",108)(835,"p"),i(836,"Hover over this card to see it lift up with enhanced shadow."),t()(),e(837,"ui-card",109)(838,"p"),i(839,"This card stays in place without hover effects."),t()()(),e(840,"div",104)(841,"pre")(842,"code"),i(843,`<ui-card [hoverable]="true">...</ui-card>
<ui-card [hoverable]="false">...</ui-card>`),t()()(),e(844,"div",11)(845,"h3"),i(846,"Glass Card (Blur Effect)"),t()(),e(847,"div",110)(848,"ui-card",111)(849,"p"),i(850,"This card has a glass/frosted effect, perfect for overlaying on images or colored backgrounds."),t()()(),e(851,"div",104)(852,"pre")(853,"code"),i(854,`<ui-card variant="glass">
  <p>Glass effect card content</p>
</ui-card>`),t()()(),e(855,"h3",112),i(856,"Stat Cards"),t(),e(857,"p",8),i(858,"Stat cards display key metrics with optional trends and progress indicators."),t(),e(859,"div",113),d(860,"ui-stat-card",114)(861,"ui-stat-card",115)(862,"ui-stat-card",116)(863,"ui-stat-card",117),t(),e(864,"div",104)(865,"pre")(866,"code"),i(867,`<ui-stat-card
  label="Total Users"
  [value]="12847"
  [showTrend]="true"
  [trendValue]="12.5"
  trendDirection="up"
  description="vs last month"
  color="primary">
</ui-stat-card>

<!-- With currency format -->
<ui-stat-card
  label="Revenue"
  [value]="48520"
  format="currency"
  [showTrend]="true"
  [trendValue]="-3.2"
  trendDirection="down">
</ui-stat-card>

<!-- With progress bar -->
<ui-stat-card
  label="Active Sessions"
  [value]="342"
  [showProgress]="true"
  [progress]="68">
</ui-stat-card>`),t()()(),e(868,"h3",112),i(869,"Stat Cards - All Colors"),t(),e(870,"div",113),v(871,ye,2,7,"ui-stat-card",118,h),t()(),d(873,"ui-divider",119),e(874,"section",6)(875,"h2",7),i(876,"Alerts"),t(),e(877,"p",8),i(878,"Alerts provide contextual feedback messages for user actions. Use different colors and variants to convey the importance and type of message."),t(),e(879,"div",9)(880,"h4"),i(881,"API Reference"),t(),e(882,"table",10)(883,"thead")(884,"tr")(885,"th"),i(886,"Input"),t(),e(887,"th"),i(888,"Type"),t(),e(889,"th"),i(890,"Default"),t(),e(891,"th"),i(892,"Description"),t()()(),e(893,"tbody")(894,"tr")(895,"td")(896,"code"),i(897,"variant"),t()(),e(898,"td")(899,"code"),i(900,"'soft' | 'filled' | 'outlined' | 'accent'"),t()(),e(901,"td")(902,"code"),i(903,"'soft'"),t()(),e(904,"td"),i(905,"Visual style variant"),t()(),e(906,"tr")(907,"td")(908,"code"),i(909,"color"),t()(),e(910,"td")(911,"code"),i(912,"'info' | 'success' | 'warning' | 'danger' | 'primary'"),t()(),e(913,"td")(914,"code"),i(915,"'info'"),t()(),e(916,"td"),i(917,"Color scheme based on message type"),t()(),e(918,"tr")(919,"td")(920,"code"),i(921,"title"),t()(),e(922,"td")(923,"code"),i(924,"string"),t()(),e(925,"td"),i(926,"-"),t(),e(927,"td"),i(928,"Alert title/header"),t()(),e(929,"tr")(930,"td")(931,"code"),i(932,"dismissible"),t()(),e(933,"td")(934,"code"),i(935,"boolean"),t()(),e(936,"td")(937,"code"),i(938,"false"),t()(),e(939,"td"),i(940,"Shows close button"),t()()()()(),e(941,"div",11)(942,"h3"),i(943,"Alert Colors - Soft Variant"),t(),e(944,"div",12)(945,"div",120)(946,"ui-alert",121),i(947," This is an informational message for the user. "),t(),e(948,"ui-alert",122),i(949," Your changes have been saved successfully. "),t(),e(950,"ui-alert",123),i(951," Please review your input before submitting. "),t(),e(952,"ui-alert",124),i(953," Something went wrong. Please try again. "),t()(),e(954,"div",15)(955,"pre")(956,"code"),i(957,`<ui-alert color="info" variant="soft" title="Information">
  This is an informational message.
</ui-alert>

<ui-alert color="success" variant="soft" title="Success!">
  Your changes have been saved.
</ui-alert>

<ui-alert color="warning" variant="soft" title="Warning">
  Please review your input.
</ui-alert>

<ui-alert color="danger" variant="soft" title="Error">
  Something went wrong.
</ui-alert>`),t()()()()(),e(958,"div",11)(959,"h3"),i(960,"Alert Colors - Filled Variant"),t(),e(961,"div",12)(962,"div",120)(963,"ui-alert",125),i(964," This is a filled info alert with strong presence. "),t(),e(965,"ui-alert",126),i(966," Operation completed successfully! "),t(),e(967,"ui-alert",127),i(968," This action cannot be undone. "),t(),e(969,"ui-alert",128),i(970," System failure detected. "),t()(),e(971,"div",15)(972,"pre")(973,"code"),i(974,`<ui-alert color="info" variant="filled" title="Information">
  Filled info alert with strong presence.
</ui-alert>

<ui-alert color="success" variant="filled">...</ui-alert>
<ui-alert color="warning" variant="filled">...</ui-alert>
<ui-alert color="danger" variant="filled">...</ui-alert>`),t()()()()(),e(975,"div",11)(976,"h3"),i(977,"Alert Colors - Outlined Variant"),t(),e(978,"div",12)(979,"div",120)(980,"ui-alert",129),i(981," This is an outlined info alert. "),t(),e(982,"ui-alert",130),i(983," Task has been completed. "),t(),e(984,"ui-alert",131),i(985," Proceed with caution. "),t(),e(986,"ui-alert",132),i(987," Please fix the following errors. "),t()(),e(988,"div",15)(989,"pre")(990,"code"),i(991,`<ui-alert color="info" variant="outlined">
  Outlined alert with border.
</ui-alert>`),t()()()()(),e(992,"div",11)(993,"h3"),i(994,"Alert Colors - Accent Variant"),t(),e(995,"div",12)(996,"div",120)(997,"ui-alert",133),i(998," This is an accent info alert with left border. "),t(),e(999,"ui-alert",134),i(1e3," Your profile has been updated. "),t(),e(1001,"ui-alert",135),i(1002," Don't forget to save your work. "),t(),e(1003,"ui-alert",136),i(1004," Your session will expire soon. Click X to dismiss. "),t()(),e(1005,"div",15)(1006,"pre")(1007,"code"),i(1008,`<ui-alert color="info" variant="accent" title="Tip">
  Accent alert with left border.
</ui-alert>

<!-- Dismissible alert -->
<ui-alert
  color="danger"
  variant="accent"
  [dismissible]="true">
  Click X to dismiss.
</ui-alert>`),t()()()()(),e(1009,"div",11)(1010,"h3"),i(1011,"Dismissible Alerts"),t(),e(1012,"div",12)(1013,"div",13)(1014,"ui-alert",137),i(1015," This alert can be dismissed by clicking the X button. "),t()(),e(1016,"div",15)(1017,"pre")(1018,"code"),i(1019,`<ui-alert
  color="primary"
  variant="soft"
  title="Notification"
  [dismissible]="true">
  This alert can be dismissed.
</ui-alert>`),t()()()()(),e(1020,"div",11)(1021,"h3"),i(1022,"Modals"),t(),e(1023,"p",8),i(1024,"Modals are dialog overlays that focus user attention on important content or actions."),t(),e(1025,"div",12)(1026,"div",13)(1027,"div",26)(1028,"ui-button",138),b("click",function(){return n.openModal("sm")}),i(1029,"Small Modal"),t(),e(1030,"ui-button",139),b("click",function(){return n.openModal("md")}),i(1031,"Medium Modal"),t(),e(1032,"ui-button",140),b("click",function(){return n.openModal("lg")}),i(1033,"Large Modal"),t()()(),e(1034,"div",15)(1035,"pre")(1036,"code"),i(1037,`<!-- Trigger button -->
<ui-button (click)="openModal('md')">Open Modal</ui-button>

<!-- Modal component -->
@if (isModalOpen()) {
  <ui-modal
    [isOpen]="isModalOpen()"
    [size]="modalSize"
    title="Example Modal"
    [showCloseButton]="true"
    (close)="closeModal()">
    <p>Modal content goes here.</p>
    <div style="margin-top: 1.5rem;">
      <ui-button (click)="closeModal()">Cancel</ui-button>
      <ui-button (click)="confirm()">Confirm</ui-button>
    </div>
  </ui-modal>
}

// In component.ts:
isModalOpen = signal(false);
modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';

openModal(size: 'sm' | 'md' | 'lg') {
  this.modalSize = size;
  this.isModalOpen.set(true);
}

closeModal() {
  this.isModalOpen.set(false);
}`),t()()()()(),e(1038,"div",11)(1039,"h3"),i(1040,"Toast Notifications"),t(),e(1041,"p",8),i(1042,"Toasts provide brief, non-blocking notifications that auto-dismiss."),t(),e(1043,"div",12)(1044,"div",13)(1045,"div",26)(1046,"ui-button",141),b("click",function(){return n.showToastNotification("success")}),i(1047,"Success Toast"),t(),e(1048,"ui-button",142),b("click",function(){return n.showToastNotification("danger")}),i(1049,"Error Toast"),t(),e(1050,"ui-button",143),b("click",function(){return n.showToastNotification("warning")}),i(1051,"Warning Toast"),t(),e(1052,"ui-button",144),b("click",function(){return n.showToastNotification("info")}),i(1053,"Info Toast"),t()()(),e(1054,"div",15)(1055,"pre")(1056,"code"),i(1057,`<!-- Trigger buttons -->
<ui-button (click)="showToastNotification('success')">
  Success Toast
</ui-button>

<!-- Toast component -->
@if (showToast()) {
  <ui-toast
    [message]="'Operation completed!'"
    [color]="toastColor"
    [title]="'Success!'"
    position="top-right"
    [duration]="4000"
    [showProgress]="true"
    (dismissed)="hideToast()">
  </ui-toast>
}

// In component.ts:
showToast = signal(false);
toastColor: 'success' | 'danger' | 'warning' | 'info' = 'success';

showToastNotification(color: string) {
  this.toastColor = color;
  this.showToast.set(true);
}

hideToast() {
  this.showToast.set(false);
}`),t()()()()()(),d(1058,"ui-divider",145),e(1059,"section",6)(1060,"h2",7),i(1061,"Data Table"),t(),e(1062,"p",8),i(1063,"Tables display structured data with support for sorting, selection, pagination, and custom styling."),t(),e(1064,"div",9)(1065,"h4"),i(1066,"API Reference"),t(),e(1067,"table",10)(1068,"thead")(1069,"tr")(1070,"th"),i(1071,"Input"),t(),e(1072,"th"),i(1073,"Type"),t(),e(1074,"th"),i(1075,"Default"),t(),e(1076,"th"),i(1077,"Description"),t()()(),e(1078,"tbody")(1079,"tr")(1080,"td")(1081,"code"),i(1082,"columns"),t()(),e(1083,"td")(1084,"code"),i(1085,"TableColumn[]"),t()(),e(1086,"td"),i(1087,"-"),t(),e(1088,"td"),i(1089,"Array of column definitions"),t()(),e(1090,"tr")(1091,"td")(1092,"code"),i(1093,"data"),t()(),e(1094,"td")(1095,"code"),i(1096,"any[]"),t()(),e(1097,"td"),i(1098,"-"),t(),e(1099,"td"),i(1100,"Data rows to display"),t()(),e(1101,"tr")(1102,"td")(1103,"code"),i(1104,"variant"),t()(),e(1105,"td")(1106,"code"),i(1107,"'default' | 'striped' | 'bordered'"),t()(),e(1108,"td")(1109,"code"),i(1110,"'default'"),t()(),e(1111,"td"),i(1112,"Table visual style"),t()(),e(1113,"tr")(1114,"td")(1115,"code"),i(1116,"size"),t()(),e(1117,"td")(1118,"code"),i(1119,"'sm' | 'md' | 'lg'"),t()(),e(1120,"td")(1121,"code"),i(1122,"'md'"),t()(),e(1123,"td"),i(1124,"Row height"),t()(),e(1125,"tr")(1126,"td")(1127,"code"),i(1128,"selectable"),t()(),e(1129,"td")(1130,"code"),i(1131,"boolean"),t()(),e(1132,"td")(1133,"code"),i(1134,"false"),t()(),e(1135,"td"),i(1136,"Enable row selection"),t()(),e(1137,"tr")(1138,"td")(1139,"code"),i(1140,"showPagination"),t()(),e(1141,"td")(1142,"code"),i(1143,"boolean"),t()(),e(1144,"td")(1145,"code"),i(1146,"false"),t()(),e(1147,"td"),i(1148,"Show pagination controls"),t()(),e(1149,"tr")(1150,"td")(1151,"code"),i(1152,"loading"),t()(),e(1153,"td")(1154,"code"),i(1155,"boolean"),t()(),e(1156,"td")(1157,"code"),i(1158,"false"),t()(),e(1159,"td"),i(1160,"Show loading state"),t()(),e(1161,"tr")(1162,"td")(1163,"code"),i(1164,"emptyMessage"),t()(),e(1165,"td")(1166,"code"),i(1167,"string"),t()(),e(1168,"td"),i(1169,"-"),t(),e(1170,"td"),i(1171,"Message when no data"),t()()()()(),e(1172,"div",11)(1173,"h3"),i(1174,"Striped Table (with Selection & Pagination)"),t(),e(1175,"ui-table",146),b("sortChange",function(o){return n.onTableSort(o)})("selectionChange",function(o){return n.onTableSelectionChange(o)}),t(),e(1176,"div",104)(1177,"pre")(1178,"code"),i(1179,`<ui-table
  [columns]="tableColumns"
  [data]="tableData"
  [selectable]="true"
  variant="striped"
  [showPagination]="true"
  [pagination]="tablePagination"
  (sortChange)="onTableSort($event)"
  (selectionChange)="onTableSelectionChange($event)">
</ui-table>

// Column definition:
tableColumns: TableColumn[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
];

// Pagination config:
tablePagination = {
  page: 1,
  pageSize: 5,
  total: 20
};`),t()()()(),e(1180,"div",11)(1181,"h3"),i(1182,"Bordered Table"),t(),d(1183,"ui-table",147),e(1184,"div",104)(1185,"pre")(1186,"code"),i(1187,`<ui-table
  [columns]="tableColumns"
  [data]="tableData"
  variant="bordered"
  [rowClickable]="true">
</ui-table>`),t()()()(),e(1188,"div",11)(1189,"h3"),i(1190,"Compact Table (Smaller Size)"),t(),d(1191,"ui-table",148),e(1192,"div",104)(1193,"pre")(1194,"code"),i(1195,`<ui-table
  [columns]="tableColumns"
  [data]="tableData"
  size="sm"
  [compact]="true">
</ui-table>`),t()()()(),e(1196,"div",11)(1197,"h3"),i(1198,"Loading State"),t(),d(1199,"ui-table",149),e(1200,"div",104)(1201,"pre")(1202,"code"),i(1203,`<ui-table
  [columns]="tableColumns"
  [data]="[]"
  [loading]="true">
</ui-table>`),t()()()(),e(1204,"div",11)(1205,"h3"),i(1206,"Empty State"),t(),d(1207,"ui-table",150),e(1208,"div",104)(1209,"pre")(1210,"code"),i(1211,`<ui-table
  [columns]="tableColumns"
  [data]="[]"
  emptyMessage="No records found.">
</ui-table>`),t()()()()(),d(1212,"ui-divider",151),e(1213,"section",6)(1214,"h2",7),i(1215,"Display Components"),t(),e(1216,"p",8),i(1217,"Display components enhance UI presentation with avatars, links, and visual separators."),t(),e(1218,"div",11)(1219,"h3"),i(1220,"Avatar Sizes"),t(),e(1221,"div",12)(1222,"div",13)(1223,"div",29),d(1224,"ui-avatar",152)(1225,"ui-avatar",153)(1226,"ui-avatar",154)(1227,"ui-avatar",155)(1228,"ui-avatar",156),t()(),e(1229,"div",15)(1230,"pre")(1231,"code"),i(1232,`<ui-avatar
  src="https://example.com/avatar.jpg"
  alt="User Name"
  size="xs">
</ui-avatar>

<!-- Sizes: 'xs' | 'sm' | 'md' | 'lg' | 'xl' -->`),t()()()()(),e(1233,"div",11)(1234,"h3"),i(1235,"Avatar Shapes"),t(),e(1236,"div",12)(1237,"div",13)(1238,"div",29),d(1239,"ui-avatar",157)(1240,"ui-avatar",158)(1241,"ui-avatar",159),t()(),e(1242,"div",15)(1243,"pre")(1244,"code"),i(1245,`<ui-avatar shape="circle"></ui-avatar>
<ui-avatar shape="rounded"></ui-avatar>
<ui-avatar shape="square"></ui-avatar>`),t()()()()(),e(1246,"div",11)(1247,"h3"),i(1248,"Avatar with Initials (All Colors)"),t(),e(1249,"div",12)(1250,"div",13)(1251,"div",29),v(1252,_e,1,2,"ui-avatar",160,h),t()(),e(1254,"div",15)(1255,"pre")(1256,"code"),i(1257,`<ui-avatar
  initials="JD"
  color="primary"
  size="md">
</ui-avatar>

<!-- Colors: 'primary' | 'secondary' | 'accent' |
             'success' | 'warning' | 'danger' |
             'info' | 'neutral' -->`),t()()()()(),e(1258,"div",11)(1259,"h3"),i(1260,"Avatar with Status Badge"),t(),e(1261,"div",12)(1262,"div",13)(1263,"div",29),d(1264,"ui-avatar",161)(1265,"ui-avatar",162)(1266,"ui-avatar",163)(1267,"ui-avatar",164),t()(),e(1268,"div",15)(1269,"pre")(1270,"code"),i(1271,`<ui-avatar
  src="https://example.com/avatar.jpg"
  size="lg"
  [showBadge]="true"
  badgeColor="success">
</ui-avatar>

<!-- Badge indicates online/offline status -->
<!-- badgeColor: 'success' (online),
                'warning' (away),
                'danger' (busy),
                'info' (custom) -->`),t()()()()(),e(1272,"div",11)(1273,"h3"),i(1274,"Links"),t(),e(1275,"div",12)(1276,"div",13)(1277,"div",26)(1278,"ui-link",165),i(1279,"Default Link"),t(),e(1280,"ui-link",166),i(1281,"Primary Link"),t(),e(1282,"ui-link",167),i(1283,"Secondary Link"),t(),e(1284,"ui-link",168),i(1285,"Always Underlined"),t(),e(1286,"ui-link",169),i(1287,"External Link \u2197"),t()(),e(1288,"div",170)(1289,"ui-link",171),i(1290,"Success Link"),t(),e(1291,"ui-link",172),i(1292,"Warning Link"),t(),e(1293,"ui-link",173),i(1294,"Danger Link"),t(),e(1295,"ui-link",174),i(1296,"Info Link"),t(),e(1297,"ui-link",175),i(1298,"No Underline"),t()()(),e(1299,"div",15)(1300,"pre")(1301,"code"),i(1302,`<ui-link href="/">Default Link</ui-link>

<ui-link href="/" color="primary">Primary</ui-link>

<ui-link href="/" underline="always">
  Always Underlined
</ui-link>

<!-- External link (opens in new tab) -->
<ui-link href="https://google.com" [external]="true">
  External Link \u2197
</ui-link>

<!-- Underline options: 'hover' | 'always' | 'none' -->`),t()()()()(),e(1303,"div",11)(1304,"h3"),i(1305,"Dividers"),t(),e(1306,"div",12)(1307,"div",120)(1308,"p"),i(1309,"Solid divider:"),t(),d(1310,"ui-divider"),e(1311,"p"),i(1312,"Dashed divider:"),t(),d(1313,"ui-divider",176),e(1314,"p"),i(1315,"Dotted divider:"),t(),d(1316,"ui-divider",177),e(1317,"p"),i(1318,"Divider with label (left):"),t(),d(1319,"ui-divider",178),e(1320,"p"),i(1321,"Divider with label (center):"),t(),d(1322,"ui-divider",179),e(1323,"p"),i(1324,"Divider with label (right):"),t(),d(1325,"ui-divider",180),t(),e(1326,"div",15)(1327,"pre")(1328,"code"),i(1329,`<!-- Basic divider -->
<ui-divider></ui-divider>

<!-- Variants -->
<ui-divider variant="dashed"></ui-divider>
<ui-divider variant="dotted"></ui-divider>

<!-- With label -->
<ui-divider
  label="Section"
  labelPosition="left">
</ui-divider>

<ui-divider
  label="OR"
  labelPosition="center">
</ui-divider>

<ui-divider
  label="End"
  labelPosition="right">
</ui-divider>`),t()()()()()(),d(1330,"ui-divider",181),e(1331,"section",6)(1332,"h2",7),i(1333,"Loading States"),t(),e(1334,"p",8),i(1335,"Loading indicators provide visual feedback during async operations. Use spinners for indeterminate loading and skeletons for content placeholders."),t(),e(1336,"div",9)(1337,"h4"),i(1338,"Spinner API Reference"),t(),e(1339,"table",10)(1340,"thead")(1341,"tr")(1342,"th"),i(1343,"Input"),t(),e(1344,"th"),i(1345,"Type"),t(),e(1346,"th"),i(1347,"Default"),t(),e(1348,"th"),i(1349,"Description"),t()()(),e(1350,"tbody")(1351,"tr")(1352,"td")(1353,"code"),i(1354,"size"),t()(),e(1355,"td")(1356,"code"),i(1357,"'xs' | 'sm' | 'md' | 'lg' | 'xl'"),t()(),e(1358,"td")(1359,"code"),i(1360,"'md'"),t()(),e(1361,"td"),i(1362,"Spinner size"),t()(),e(1363,"tr")(1364,"td")(1365,"code"),i(1366,"color"),t()(),e(1367,"td")(1368,"code"),i(1369,"'primary' | 'secondary' | ... "),t()(),e(1370,"td")(1371,"code"),i(1372,"'primary'"),t()(),e(1373,"td"),i(1374,"Spinner color"),t()()()()(),e(1375,"div",11)(1376,"h3"),i(1377,"Spinner Sizes"),t(),e(1378,"div",12)(1379,"div",13)(1380,"div",29)(1381,"div",182),d(1382,"ui-spinner",183),e(1383,"p",184),i(1384,"XS"),t()(),e(1385,"div",182),d(1386,"ui-spinner",185),e(1387,"p",184),i(1388,"SM"),t()(),e(1389,"div",182),d(1390,"ui-spinner",186),e(1391,"p",184),i(1392,"MD"),t()(),e(1393,"div",182),d(1394,"ui-spinner",187),e(1395,"p",184),i(1396,"LG"),t()(),e(1397,"div",182),d(1398,"ui-spinner",188),e(1399,"p",184),i(1400,"XL"),t()()()(),e(1401,"div",15)(1402,"pre")(1403,"code"),i(1404,`<ui-spinner size="xs"></ui-spinner>
<ui-spinner size="sm"></ui-spinner>
<ui-spinner size="md"></ui-spinner>
<ui-spinner size="lg"></ui-spinner>
<ui-spinner size="xl"></ui-spinner>`),t()()()()(),e(1405,"div",11)(1406,"h3"),i(1407,"Spinner Colors"),t(),e(1408,"div",12)(1409,"div",13)(1410,"div",29),v(1411,we,5,4,"div",182,h),t()(),e(1413,"div",15)(1414,"pre")(1415,"code"),i(1416,`<ui-spinner color="primary"></ui-spinner>
<ui-spinner color="secondary"></ui-spinner>
<ui-spinner color="success"></ui-spinner>
<ui-spinner color="danger"></ui-spinner>`),t()()()()(),e(1417,"div",189)(1418,"h4"),i(1419,"Skeleton API Reference"),t(),e(1420,"table",10)(1421,"thead")(1422,"tr")(1423,"th"),i(1424,"Input"),t(),e(1425,"th"),i(1426,"Type"),t(),e(1427,"th"),i(1428,"Default"),t(),e(1429,"th"),i(1430,"Description"),t()()(),e(1431,"tbody")(1432,"tr")(1433,"td")(1434,"code"),i(1435,"variant"),t()(),e(1436,"td")(1437,"code"),i(1438,"'circular' | 'rectangular' | 'text'"),t()(),e(1439,"td")(1440,"code"),i(1441,"'text'"),t()(),e(1442,"td"),i(1443,"Shape variant"),t()(),e(1444,"tr")(1445,"td")(1446,"code"),i(1447,"width"),t()(),e(1448,"td")(1449,"code"),i(1450,"string"),t()(),e(1451,"td")(1452,"code"),i(1453,"'100%'"),t()(),e(1454,"td"),i(1455,"Element width"),t()(),e(1456,"tr")(1457,"td")(1458,"code"),i(1459,"height"),t()(),e(1460,"td")(1461,"code"),i(1462,"string"),t()(),e(1463,"td")(1464,"code"),i(1465,"'20px'"),t()(),e(1466,"td"),i(1467,"Element height"),t()()()()(),e(1468,"div",11)(1469,"h3"),i(1470,"Skeleton Loaders - Basic Shapes"),t(),e(1471,"div",12)(1472,"div",13)(1473,"div",190)(1474,"div",182),d(1475,"ui-skeleton",191),e(1476,"p",192),i(1477,"Circular"),t()(),e(1478,"div",182),d(1479,"ui-skeleton",193),e(1480,"p",192),i(1481,"Rectangular"),t()(),e(1482,"div",182),d(1483,"ui-skeleton",194),e(1484,"p",192),i(1485,"Text"),t()()()(),e(1486,"div",15)(1487,"pre")(1488,"code"),i(1489,`<!-- Avatar placeholder -->
<ui-skeleton
  variant="circular"
  width="64px"
  height="64px">
</ui-skeleton>

<!-- Image placeholder -->
<ui-skeleton
  variant="rectangular"
  width="100px"
  height="64px">
</ui-skeleton>

<!-- Text line placeholder -->
<ui-skeleton
  variant="text"
  width="150px"
  height="20px">
</ui-skeleton>`),t()()()()(),e(1490,"div",11)(1491,"h3"),i(1492,"Skeleton Card Loading Pattern"),t(),e(1493,"div",12)(1494,"div",13)(1495,"div",195)(1496,"div",196),d(1497,"ui-skeleton",197),e(1498,"div",198),d(1499,"ui-skeleton",199)(1500,"ui-skeleton",200),t()(),d(1501,"ui-skeleton",201)(1502,"ui-skeleton",202)(1503,"ui-skeleton",203)(1504,"ui-skeleton",204),t()(),e(1505,"div",15)(1506,"pre")(1507,"code"),i(1508,`<!-- Card skeleton pattern -->
<div class="skeleton-card">
  <!-- Header with avatar -->
  <div class="skeleton-header">
    <ui-skeleton variant="circular"
      width="48px" height="48px"></ui-skeleton>
    <div>
      <ui-skeleton variant="text"
        width="150px"></ui-skeleton>
      <ui-skeleton variant="text"
        width="100px" height="12px"></ui-skeleton>
    </div>
  </div>

  <!-- Image placeholder -->
  <ui-skeleton variant="rectangular"
    width="100%" height="120px"></ui-skeleton>

  <!-- Text content -->
  <ui-skeleton variant="text" width="100%"></ui-skeleton>
  <ui-skeleton variant="text" width="80%"></ui-skeleton>
  <ui-skeleton variant="text" width="60%"></ui-skeleton>
</div>`),t()()()()(),e(1509,"div",11)(1510,"h3"),i(1511,"Skeleton List Loading Pattern"),t(),e(1512,"div",12)(1513,"div",13)(1514,"div",205),v(1515,ke,5,0,"div",206,h),t()(),e(1517,"div",15)(1518,"pre")(1519,"code"),i(1520,`<!-- List item skeleton -->
@for (i of [1, 2, 3, 4]; track i) {
  <div class="list-item">
    <ui-skeleton variant="circular"
      width="40px" height="40px"></ui-skeleton>
    <div>
      <ui-skeleton variant="text"
        width="80%"></ui-skeleton>
      <ui-skeleton variant="text"
        width="60%" height="12px"></ui-skeleton>
    </div>
  </div>
}`),t()()()()(),e(1521,"div",11)(1522,"h3"),i(1523,"Loading Button Demo"),t(),e(1524,"div",12)(1525,"div",13)(1526,"div",26)(1527,"ui-button",207),b("click",function(){return n.simulateLoading()}),i(1528),t(),e(1529,"ui-button",208),b("click",function(){return n.simulateLoading()}),i(1530),t()()(),e(1531,"div",15)(1532,"pre")(1533,"code"),i(1534),t()()()()()(),M(1535,Te,10,4,"ui-modal",209),M(1536,Me,1,5,"ui-toast",210),e(1537,"footer",211),d(1538,"ui-divider"),e(1539,"p"),i(1540,"Built with \u2764\uFE0F using Angular 19+ | Quizzy UI Component Library"),t()()()),l&2&&(a(58),r("items",n.breadcrumbItems),a(10),r("items",n.breadcrumbItems),a(10),r("items",n.breadcrumbItems),a(10),r("items",n.breadcrumbItems),a(10),r("items",n.longBreadcrumbItems),a(83),r("tabs",n.tabItems)("activeTab",n.activeTab),a(8),r("tabs",n.tabItems2)("activeTab",n.activeTab),a(8),r("tabs",n.tabItems3)("activeTab",n.activeTab),a(8),r("tabs",n.tabItems4)("activeTab",n.activeTab),a(92),S(n.buttonVariants),a(12),S(n.colors),a(12),S(n.sizes),a(14),r("disabled",!0),a(2),r("loading",!0),a(11),r("uiTooltip","Helpful information appears here!"),a(2),r("uiTooltip","Bottom tooltip"),a(2),r("uiTooltip","Left tooltip"),a(2),r("uiTooltip","Right tooltip"),a(83),r("disabled",!0),a(3),r("loading",!0),a(3),r("rounded",!1),a(13),S(n.colors),a(87),S(n.colors),a(12),S(n.sizes),a(12),S(n.colors),a(12),S(n.colors),a(16),u("ngModel",n.inputValue),a(24),r("disabled",!0),a(8),u("ngModel",n.passwordValue),a(),r("clearable",!0),a(),r("prefix",!0)("suffix",!0),a(12),u("ngModel",n.textareaValue),r("rows",4)("showCharacterCount",!0)("maxlength",200),a(8),r("options",n.selectOptions),u("ngModel",n.selectedOption),r("searchable",!0)("clearable",!0),a(8),u("ngModel",n.checkboxValue),a(),r("indeterminate",!0),a(),r("disabled",!0),a(4),u("ngModel",n.demoCheckboxPrimary),a(),u("ngModel",n.demoCheckboxSecondary),a(),u("ngModel",n.demoCheckboxAccent),a(),u("ngModel",n.demoCheckboxSuccess),a(),u("ngModel",n.demoCheckboxWarning),a(),u("ngModel",n.demoCheckboxDanger),a(8),u("ngModel",n.toggleValue),a(),r("showIcons",!0),a(),r("disabled",!0),a(4),u("ngModel",n.demoTogglePrimary),a(),u("ngModel",n.demoToggleSecondary),a(),u("ngModel",n.demoToggleAccent),a(),u("ngModel",n.demoToggleSuccess),a(),u("ngModel",n.demoToggleWarning),a(),u("ngModel",n.demoToggleDanger),a(8),u("ngModel",n.radioValue),a(),u("ngModel",n.radioValue),a(),r("disabled",!0),a(109),r("clickable",!0),a(28),r("hoverable",!0),a(3),r("hoverable",!1),a(23),r("value",12847)("showTrend",!0)("trendValue",12.5),a(),r("value",48520)("showTrend",!0)("trendValue",-3.2),a(),r("value",342)("showProgress",!0)("progress",68),a(),r("showTrend",!0)("trendValue",5.8),a(8),S(n.colors),a(132),r("dismissible",!0),a(11),r("dismissible",!0),a(161),r("columns",n.tableColumns)("data",n.tableData)("selectable",!0)("showPagination",!0)("pagination",n.tablePagination),a(8),r("columns",n.tableColumns)("data",n.tableData)("rowClickable",!0),a(8),r("columns",n.tableColumns)("data",n.tableData)("compact",!0),a(8),r("columns",n.tableColumns)("data",k(101,ue))("loading",!0),a(8),r("columns",n.tableColumns)("data",k(102,ue)),a(45),S(n.colors),a(12),r("showBadge",!0),a(),r("showBadge",!0),a(),r("showBadge",!0),a(),r("showBadge",!0),a(19),r("external",!0),a(125),S(n.colors),a(104),S(k(103,ge)),a(12),r("loading",n.isLoading),a(),w(" ",n.isLoading?"Loading...":"Click to Load"," "),a(),r("loading",n.isLoading),a(),w(" ",n.isLoading?"Please wait...":"Load Data"," "),a(4),w(`<ui-button
  [loading]="isLoading"
  (click)="simulateLoading()">
  `,n.isLoading?"Loading...":"Click to Load",`
</ui-button>

// In component.ts:
isLoading = false;

simulateLoading() {
  this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false;
  }, 2000);
}`),a(),P(n.isModalOpen()?1535:-1),a(),P(n.showToast()?1536:-1))},dependencies:[L,A,B,V,W,N,F,R,U,H,G,X,j,q,Y,J,Q,K,Z,$,ee,te,ie,ne,ae,oe,re,le,de,me,se,ce,D,O],styles:[".showcase[_ngcontent-%COMP%]{max-width:1400px;margin:0 auto;padding:2rem;min-height:100vh;background:var(--surface-base);color:var(--text-primary)}.showcase__header[_ngcontent-%COMP%]{text-align:center;margin-bottom:2rem}.showcase__header-row[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;gap:1rem;flex-wrap:wrap}.showcase__title[_ngcontent-%COMP%]{font-size:2.5rem;font-weight:700;color:var(--text-primary);margin:0}.showcase__subtitle[_ngcontent-%COMP%]{font-size:1.125rem;color:var(--text-secondary);margin:0}.showcase__description[_ngcontent-%COMP%]{font-size:.95rem;color:var(--text-tertiary);margin-top:.75rem}.showcase__section[_ngcontent-%COMP%]{margin:3rem 0}.showcase__footer[_ngcontent-%COMP%]{margin-top:4rem;text-align:center;color:var(--text-tertiary);font-size:.875rem}.showcase__footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:1rem}.section-title[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:600;color:var(--text-primary);margin:0 0 1.5rem;padding-bottom:.5rem;border-bottom:2px solid var(--color-primary-500);display:inline-block}.component-description[_ngcontent-%COMP%]{font-size:.95rem;color:var(--text-secondary);margin:0 0 1.5rem;line-height:1.6}.component-hint[_ngcontent-%COMP%]{font-size:.85rem;color:var(--text-tertiary);margin:0 0 1rem;font-style:italic}.component-api[_ngcontent-%COMP%]{margin-bottom:2rem;padding:1rem;background:var(--surface-sunken);border-radius:var(--radius-lg);border:1px solid var(--border-default)}.component-api[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.9rem;font-weight:600;color:var(--text-primary);margin:0 0 .75rem;text-transform:uppercase;letter-spacing:.05em}.api-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:.85rem;margin-bottom:1rem}.api-table[_ngcontent-%COMP%]:last-child{margin-bottom:0}.api-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .api-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:.5rem .75rem;text-align:left;border-bottom:1px solid var(--border-subtle)}.api-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background:var(--surface-raised);font-weight:600;color:var(--text-secondary);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em}.api-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{color:var(--text-primary)}.api-table[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:var(--surface-raised);padding:.125rem .375rem;border-radius:var(--radius-sm);font-family:Fira Code,Consolas,monospace;font-size:.8rem;color:var(--color-primary-600)}.demo-group[_ngcontent-%COMP%]{margin-bottom:2rem}.demo-group[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1rem;font-weight:600;color:var(--text-secondary);margin:0 0 1rem;text-transform:uppercase;letter-spacing:.05em}.demo-group[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.875rem;font-weight:500;color:var(--text-tertiary);margin:0 0 .75rem}.demo-with-code[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start}@media (max-width: 1024px){.demo-with-code[_ngcontent-%COMP%]{grid-template-columns:1fr}}.demo-preview[_ngcontent-%COMP%]{padding:1.5rem;background:var(--surface-raised);border-radius:var(--radius-lg);border:1px solid var(--border-default)}.demo-preview--vertical[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem}.code-block[_ngcontent-%COMP%]{background:#1e1e2e;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border-default)}.code-block--inline[_ngcontent-%COMP%]{margin-top:1rem}.code-block[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]{margin:0;padding:1rem;overflow-x:auto;font-size:.8rem;line-height:1.5}.code-block[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{font-family:Fira Code,Consolas,Monaco,monospace;color:#cdd6f4;background:transparent;white-space:pre}.demo-row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.75rem;align-items:flex-start}.demo-row--align-center[_ngcontent-%COMP%]{align-items:center}.demo-item[_ngcontent-%COMP%]{flex:1;min-width:200px;padding:1rem;background:var(--surface-raised);border-radius:var(--radius-lg);border:1px solid var(--border-default)}.demo-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}.demo-grid--cards[_ngcontent-%COMP%]{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}.demo-grid--stats[_ngcontent-%COMP%]{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.skeleton-demo[_ngcontent-%COMP%]{max-width:400px;padding:1rem;background:var(--surface-raised);border-radius:var(--radius-lg);border:1px solid var(--border-default)}.skeleton-demo[_ngcontent-%COMP%]   .skeleton-row[_ngcontent-%COMP%]{display:flex;gap:1rem;align-items:center;margin-bottom:1rem}.skeleton-demo[_ngcontent-%COMP%]   .skeleton-content[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;gap:.5rem}.skeleton-demo[_ngcontent-%COMP%]   ui-skeleton[_ngcontent-%COMP%]{margin-bottom:.5rem}@media (max-width: 768px){.showcase[_ngcontent-%COMP%]{padding:1rem}.showcase__title[_ngcontent-%COMP%]{font-size:1.75rem}.showcase__subtitle[_ngcontent-%COMP%]{font-size:1rem}.demo-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.demo-item[_ngcontent-%COMP%]{min-width:100%}.demo-with-code[_ngcontent-%COMP%]{grid-template-columns:1fr}.api-table[_ngcontent-%COMP%]{display:block;overflow-x:auto}}[data-theme=dark][_ngcontent-%COMP%]   .showcase[_ngcontent-%COMP%]{background:var(--surface-base)}[data-theme=dark][_ngcontent-%COMP%]   .demo-item[_ngcontent-%COMP%], [data-theme=dark][_ngcontent-%COMP%]   .skeleton-demo[_ngcontent-%COMP%], [data-theme=dark][_ngcontent-%COMP%]   .demo-preview[_ngcontent-%COMP%]{background:var(--surface-raised);border-color:var(--border-default)}[data-theme=dark][_ngcontent-%COMP%]   .component-api[_ngcontent-%COMP%]{background:var(--surface-sunken);border-color:var(--border-default)}[data-theme=dark][_ngcontent-%COMP%]   .code-block[_ngcontent-%COMP%]{background:#1e1e2e;border-color:#313244}"]})};export{pe as ShowcaseComponent};
