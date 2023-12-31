import 'server-only';

import { marked } from 'marked';
import qs from 'qs';

export const CACHE_TAG_REVIEWS = 'reviews';

const CMS_URL = 'http://localhost:1337';
console.log('CMS_URL:', CMS_URL);
// content/reviews 파일에 있는 마크다운 파일을 웹과 연동시킬 때 쓰인 코드
export async function getReview(slug){
    const { data } = await fetchReviews({
        filters: { slug: { $eq: slug } },
        fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
        populate: { image: { fields: ['url'] } },
        pagination: { pageSize: 1, withCount: false },
      });
      if (data.length === 0){
        return null;
      }
    const item = data[0];
    return {
        ...toReview(item),
        body: marked(item.attributes.body, { headerIds: false, mangle: false }),
  };
}
// 마크다운을 웹에 표현할 때 쓰인 코드
export async function getReviews(pageSize, page){
    const { data, meta } = await fetchReviews({
        fields: ['slug', 'title', 'subtitle', 'publishedAt'],
        populate: { image: { fields: ['url'] } },
        sort: ['publishedAt:desc'],
        pagination: { pageSize, page },
    });
    return {
        pageCount: meta.pagination.pageCount,
        reviews: data.map(toReview),
    };
}

export async function searchReviews(query){
    const { data } = await fetchReviews({
        filters: { slug: { $containsi: query }},
        fields: ['slug', 'title'],
        sort: ['title'],
        pagination: { pageSize: 5 },
    });
    return data.map(({ attributes }) => ({
        slug: attributes.slug,
        title: attributes.title,
    }));
}

export async function getSlugs(){
    const { data } = await fetchReviews({
        fields: ['slug'],
        sort: ['publishedAt:desc'],
        pagination: { pageSize: 100 },
    });
    return data.map((item) => item.attributes.slug);
}

export async function fetchReviews(parameters){
    const url = `${CMS_URL}/api/reviews?`
    + qs.stringify(parameters, { encodeValuesOnly: true });
    // console.log(['[fetchReviews]:', url]);
    const response = await fetch(url, {
        next: {
            tags: [CACHE_TAG_REVIEWS],
        },
    });
    if (!response.ok){
        throw new Error(`CMS returned ${response.status} for ${url}`);
    }
    return await response.json();
}

function toReview(item){
    const { attributes } = item;
    return {
        slug: attributes.slug,
        title: attributes.title,
        subtitle: attributes.subtitle,
        data: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
        image: new URL(attributes.image.data.attributes.url, CMS_URL).href,
    };
}
