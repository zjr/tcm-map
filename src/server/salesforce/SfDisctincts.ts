// noinspection SqlNoDataSourceInspection

import { SfClient } from './SfClient';

export default class SfDistincts extends SfClient {
	async getDistinctIndustries() {
		const url = this.getRestUrl('/query');
		url.searchParams.set(
			'q',
			`
				SELECT
					Industry_3__c, COUNT(Name)
				FROM
					Account
				WHERE
					TCM_Member__c = true and
					IsDeleted <> true
				GROUP BY
					Industry_3__c
			`
		);

		interface Distincts {
			attributes: {
				type: string;
			};
			Industry_3__c: string;
			expr0: number;
		}

		const data = await this.queryFetcher<Distincts>(url);

		return data.map(x => x.Industry_3__c);
	}

	async getDistinctCounties() {
		const url = this.getRestUrl('/query');
		url.searchParams.set(
			'q',
			`
				SELECT County__c
				FROM Account
				WHERE County__c <> NULL
					AND TCM_Member__c = true
					AND IsDeleted <> true
			`
		);

		interface Distincts {
			attributes: {
				type: string;
			};
			County__c: string;
			expr0: number;
		}

		const counties = new Set();
		const data = await this.queryFetcher<Distincts>(url);
		data.forEach(x => counties.add(x.County__c));

		return counties.values();
	}

	async getDistinctRegions() {
		const url = this.getRestUrl('/query');
		url.searchParams.set(
			'q',
			`
				SELECT
					Region_2_0__c
				FROM
					Account
				WHERE
					Region_2_0__C <> NULL AND
					TCM_Member__c = true AND
					IsDeleted <> true
			`
		);

		interface Distincts {
			attributes: {
				type: string;
			};
			Region_2_0__c: string;
			expr0: number;
		}

		const regions = new Set();
		const data = await this.queryFetcher<Distincts>(url);
		data.forEach(x => regions.add(x.Region_2_0__c));

		return regions.values();
	}
}

// (async () => {
// 	await sfClient.authorized;
// 	return await sfClient.getDistinctCounties();
// })()
// 	.then(console.log)
// 	.catch(console.error);
