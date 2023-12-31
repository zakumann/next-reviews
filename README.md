This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## 11/15/2023

Tailwind 사용법과 params과 slug 및 마크다운을 사용하는 법을 공부했음.

마크다운을 웹과 연결시키는 방법은 아래와 같다.

```js
import { readdir, readFile } from 'node:fs/promises';
```

node:fs/promises를 통해서 마크다운 파일을 웹으로 가져올 수가 있다. 그리고 아래는 리뷰 페이지를 작성하는 데 쓰여진 코드이다.

```js
export default async function ReviewPage({ params: { slug } }){
    const review = await getReview(slug);
    return(
        <>
            <Heading>{review.title}</Heading>
            <p className="italic pb-2">{review.date}</p>
            <img src={review.image} alt="" 
                width="640" height="360" className="mb-2 rounded"
            />
            <article dangerouslySetInnerHTML={{ __html: review.body }} 
                className="max-w-screen-sm prose prose-slate"
            />
        </>
    );
}

```

위의 코드를 통해서 리뷰 페이지를 생성하는데 쓰여졌다.

### Slug

wild card처럼 다양한 값을 받을수 있는데, 하나의 파일로 여러 파일을 대체할 수 있다.

### slug 값의 활용

useRouter 훅을 이용하여 다양하게 사용할 수 있다.

```js
import { useRouter } from 'next/router';
const router = useRouter();
const { slug } = router.query;
// 여기서 slug는 지정해준 파일이름이 된다
```

## 11/16/2023
Nextjs에 쓰이는 메타데이터에 관한 학습이다. 아래는 metadata에 쓰이는 기본 코드다. 코드는 2023년 11월 16일 기준이다.

```js
export const metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

### 제목 바꾸기
제목을 바꾸는 방법은 리뷰 페이지에 [slug]로 들어가서 안에 있는 page.jsx의 코드에 아래의 코들르 추가했다.

```js
export async function generateMetadata({ params: { slug } }){
    const review = await getReview(slug);
    return {
        title: review.title,
    }
}
```
위와 같은 코드를 통해서 일일이 코드에 손을 대지 않아도 자동으로 바뀔 수 있게 한다.

### 아이콘 변경하기

Nextjs에서는 아이콘을 변경하는 방법으로는 아이콘으로 쓸 파일을 가져오는 방법이 있지만, Nextjs 공식 문건에 따르면 

/app 루트에 쓰일 이미지에 favicon, icon, appe-icon이 있다. 혹은 자바스크립트나 타입스크립트를 통해서 아이콘을 만들어서 쓰는 방법도 있다.

#### 자바스크립트/타입스크립트를 통한 아이콘 만들기

```js
import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
```

그리고 props를 통해서 params를 통해서 생성하는 방법이 있는데  아래는 그 코드다.

```js
export default function Icon({ params }) {
  // ...
}
```

```ts
export default function Icon({ params }: { params: { slug: string } }) {
  // ...
}
```

## 11/17/2023

Client Component에 관한걸 공부하기 위해 사용되었고 components 폴더에 ShareLinkButton.jsx를 추가했다.

```js
export default function ShareLinkButton(){
    const handleClick = () => {
        console.log('clicked!');
    };

    return(
        <button onClick={handleClick}
            className="border px-2 py-1 rounded text-slate-500 text-sm
            hover:bg-orange-100 hover:text-slate-700">
            Share a Link
        </button>
    );
}
```
위의 코드를 작성한 다음에 reviews/[slug]/page.jsx를 통해서 링크를 추가했다.

```js
            <div className="flex gap-3 items-baseline">
            <p className="italic pb-2">{review.date}</p>
            <ShareLinkButton />
            </div>
```

위의 링크를 통해서 컴포넌트를 추가했는데, 이렇게 추가된 코드에 에러 메세지로 이벤트 핸들러는 클라이언트 컴퍼넌트 프롭을 통과할 수 없다는 매세지가 출력되었다. 그래서, 맨 윗칸에다 코드를 추가했다.

```js
'use client'
```

그러자, 화면이 출력되었다. 이는 Nextjs에서는 모든 컴퍼넌트가 기본적으로 서버 컴포넌트로 이뤄져 있기 때문이다.

onClick={handleClick} 은 주로 리액트에 많이 사용되며 이를 __이벤트 핸들러__ 라고 한다. 이벤트 핸들러는 호출하는 것이 아니라 전달되어야 하는 역할을 하기 때문이다.

### 링크 복사하기

링크를 복사하기 위해서 아래의 코드를 작성했다.

```js
    const handleClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setClicked(true);
        setTimeout(() => setClicked(false), 1500);
    };
```

navigator.clipboar.writeText() 메서드를 작성한 다음에 window.location.href 를 통해서 현재 링크 페이지를 복사하는 메서드를 추가했다.

heroicon에 들어가서 원하는 아이콘을 선택하는데 여기서는 링크 주소를 복사하는 데 쓰이는 클립 아이콘을 집어넣기 위해서 다음과 같은 코드를 작성했다.

```
npm install @heroicons/react
```
그 다음에 아래의 코드를 작성했다.
```
import ShareButtons from "@/components/ShareButtons";
(중략)
<button onClick={handleClick}
            className="border flex gap-1 items-center px-2 py-1 rounded
            text-slate-500 text-sm
            hover:bg-orange-100 hover:text-slate-700">
                <LinkIcon className="h-4 w-4"/>
            {clicked ? 'Link copied!' : 'Share a Link'}
        </button>
```
이와 같이 작성함으로써 링크 버튼에 아이콘을 넣을 수 있게 되었다.

### 11/18/2023

Deployment(배포)

static export

- Any web server(어느 웹 서버에나 가능)
- Any static web hosting platform(어느 정적 웹 호스팅 플랫폼)

Vercel이란 곳이 있는데 이곳은 깃허브와 연동이 가능해서 깃허브에 있는 Nextjs를 연동시킬 수가 있다.

덧붙여서, 서버와 관련된 명령문으로 터미널에 아래와 같이 작성한다.

```
npx serve@latest out
```

위의 코드는 서버의 상태를 점검하는 데 적합한 코드다.

## 11/19/2023

### Headless CMS란?

Headless란 직역하면 머리가 없다는 뜻이다. 웹사이트를 만들때는 반드시 컨텐츠(데이터)가 필요하다. 머리는 컨텐츠를 보여줄 수단(웹사이트, ios, 안드로이드 등..)을 의미하고 몸통은 컨텐츠를 의미한다. 즉, 머리(표현 수단)를 언제든 바꿔 끼울 수 있다는 뜻이다.

컨텐츠와 view를 분리하는것이 Headless CMS의 핵심이다. Headless CMS는 Restful API로 컨텐츠에 접근 및 수정하여 사용한다.

## 11/21/2023
CSM와 Nextjs를 연동시키는 방법으로 csm을 작동시키고 nextjs를 작동시키는 것이다. 아래는 strapi를 설치하는 명령문이다.

```
npx create-strapi-app@latest my-project
```

그렇게 설치가 완료된 csm를 통해서 localhost:1337을 통해서 데이터로 접속한다. 만약, 여기에 계정이 없다면 계정을 만들어서 들어가면 된다.
계정을 만든 다음에 콘텐츠를 작성한다. 그리고, strapi가 작동될 때, nextjs를 작동시키면 되고 reviews.js에 있는 코드를 아래와 같이 수정했다.

```js
export async function getReviews(){
    const url = 'http://localhost:1337/api/reviews?'
    + qs.stringify({
        fields: ['slug', 'title', 'subtitle', 'publishedAt'],
        populate: { image: { fields: ['url'] } },
        sort: ['publishedAt:desc'],
        pagination: { pageSize: 6 },
        }, { encodeValuesOnly: true });
    console.log(['getReviews:', url]);
    const response = await fetch(url);
    const { data } = await response.json();
    return data.map(({ attributes }) => ({
        slug: attributes.slug,
        title: attributes.title,
    }));
}
```

## 11/22/2023

오늘은 코드 리팩토링을 배웠다.
서버에서 