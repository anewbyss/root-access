package main

func makeCounter(start int) func() int {
	n := start
	return func() int {
		n++
		return n
	}
}

func minMax(nums ...int) (min, max int) {
	if len(nums) == 0 {
		return
	}
	min, max = nums[0], nums[0]
	for _, n := range nums {
		if n < min {
			min = n
		}
		if n > max {
			max = n
		}
	}
	return
}
