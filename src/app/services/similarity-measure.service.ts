import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SimilarityMeasureService {

  _alpha = 0.5;
  _k = -1
  constructor() { }

  public _getSimilarity(individual: any, colectivo: any, k: number) {
    this._k = k;
    let ret = 0;
    if (this._k < 0) {
      this._k = individual.length;
    }
    let _result = this._getSimilarityExtended(individual, colectivo);
    ret = _result.level as number;
    return ret;
  }

  private _getSimilarityExtended(individual: any, colectiva: any) {

    let  spotComparisons = this._getSpotComparisons(individual, colectiva);

    let sumAbs = 0;
		let n = spotComparisons.length;
    spotComparisons.forEach((sc:any) => {
      sumAbs += Math.abs(sc.difference);
    });
    let grossLevel = 1 - sumAbs / n;

    let cdfMembership = this._approximateMembershipCDF(individual, colectiva)                           ;
		let cdfNonMembership = this._approximateNonMembershipCDF(individual, colectiva);

    let _result:any = {
      CDFMembership: 0,
      CDFNonMembership: 0,
      CDF: 0,
      grossLevel:0,
      level:0
    };
    _result['CDFMembership'] = cdfMembership;
    _result['CDFNonMembership'] = cdfNonMembership;
    _result['CDF'] = (cdfMembership + cdfNonMembership) / 2;
    _result['grossLevel'] = grossLevel;
    _result['level'] = grossLevel * _result.CDF;
    return _result;
  }

  private _approximateMembershipCDF(p: any, q: any){
    let ret = 0;

		let n = p.length;
		let j = 0;
		let sumSpotResults = 0;
    let aux = 0;
    let valaux = false;

			if (n == 0){
				return ret;
			}

		  let sortedP = p.slice().sort((a:any, b:any) => b.membership - a.membership);

      sortedP.forEach((element:any) => {
        let spotResult = this._getSpotRatio(p.find((item:any) => item.id === element.id), q.find((item:any) => item.id === element.id));
        sumSpotResults += spotResult;
				j++;
				if (j >= this._k){
          aux = sumSpotResults / this._k
          valaux = true;
				}
      });
			ret = sumSpotResults / this._k;
      if(valaux){
        ret = aux
      }
			return ret;
  }

  private _getSpotRatio(a:any, b:any){
			let r = 0.5;  //default value

			let a_mu = a.membership + this._alpha * a.hesitation;
			let a_nu = a.nonmembership + (1 - this._alpha) * a.hesitation;

			let b_mu = b.membership + this._alpha * b.hesitation;
			let b_nu = b.nonmembership + (1 - this._alpha) * b.hesitation;

			let o_mu = a.nonmembership + this._alpha * a.hesitation; 
			let o_nu = a.membership +  (1 - this._alpha) * a.hesitation;

			let Aao = a_mu * o_nu - a_nu * o_mu;
			let Abo = b_mu * o_nu - b_nu * o_mu;

			if (Math.abs(Aao) > 0) {
				r = Abo / Aao;
				if (r > 0) {
					r = Math.min(1, r);
				} else {
					r = 0;
				}
			}
			return r;
		
  }


  private _approximateNonMembershipCDF(p: any, q:any){
    let ret = 0;

		let n = p.length;
		let j = 0;
		let sumSpotResults = 0;
    let aux = 0;
    let valaux = false;

			if (n == 0){
				return ret;
			}

		  let sortedP = p.slice().sort((a:any, b:any) => (a.nonmembership > b.nonmembership) ? 1 : -1);

      sortedP.forEach((element:any) => {
        let spotResult = this._getSpotRatio(p.find((item:any) => item.id === element.id), q.find((item:any) => item.id === element.id));
        sumSpotResults += spotResult;
				j++;
				if (j >= this._k){
          aux = sumSpotResults / this._k
          valaux = true;
				}
      });
			ret = sumSpotResults / this._k;
      if(valaux){
        ret = aux
      }
			return ret;
  }

  private _getSpotComparisons(individual: any, colectiva: any)
		{
			let spotComparisons: any = []
			individual.forEach((p: any )=> {
        colectiva.forEach((q:any) => {
          if(p.id === q.id){
            let spotc: any = {};
            spotc['id'] = p.id
            spotc['difference'] = (p.membership - q.membership) + this._alpha * (p.hesitation - q.hesitation);
            spotComparisons.push(spotc);
          }
        });
      });
			return spotComparisons;
		}

}
