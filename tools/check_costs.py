"""Independent Python cost examples: read inputs, calculate, check expectations."""
import json
import math
from pathlib import Path

def calculate(job):
    mode = job['transport']
    if mode == 'none':
        travel = 0
    elif mode == 'car':
        travel = job['distance'] * job['consumption'] * job['fuelPrice'] / 100
    else:
        travel = job['fare'] * (2 if job['fareBasis'] == 'oneway' else 1)
    daily = travel + job['parking'] + job['tolls']
    weekly = daily * job['days']
    monthly = weekly * 52 / 12 + job['fixed']
    deductions = job.get('deductions')
    take_home = None if deductions is None else job['salary'] - deductions
    return dict(petrol=travel, daily=daily, weekly=weekly, monthly=monthly,
                takeHome=take_home, remaining=None if take_home is None else take_home-monthly)

if __name__ == '__main__':
    cases = json.loads((Path(__file__).resolve().parents[1]/'fixtures/cost-cases.json').read_text())
    for case in cases:
        actual = calculate(case['job'])
        for name, expected in case['expected'].items():
            assert actual[name] is None if expected is None else math.isclose(actual[name], expected, abs_tol=1e-8), (case['name'], name)
        print('PASS:', case['name'])
